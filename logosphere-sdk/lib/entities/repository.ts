import _ from 'lodash';
import {sha3_256} from 'js-sha3';
import { constants as c }from './entity.constants';
import { BaseEntity } from './base.entity';
import { debug, createIdentifier } from '../common/util';
import { FlureeService } from '../services/fluree/fluree.service';
import { GraphService } from '../services/graph/graph.service';
import { SchemaService } from '../services/schema/schema.service';
import { SearchQuery } from '../common/search.query';
import { Log } from '../decorators';
import { String } from 'typescript-string-operations'
import { BufferService } from '../services/buffer/buffer.service';



/**
 * Abstract base class for the Vulcan model. 
 */
export abstract class Repository {

    private _useParentState: boolean = false
    private _initialized: boolean = false
    protected _isPending: boolean = false
    
    protected _type: string
    protected _data: any = {}
    protected _frozenState: any = {}
    protected _state: any = {}
    protected _userIdentifier?: string
    protected _useBuffer = (process.env.VULCAN_L2_BUFFER === 'true') || false


    protected constructor(
        private readonly flureeService: FlureeService,
        private readonly graphService: GraphService,
        private readonly schemaService: SchemaService,
        private readonly bufferService: BufferService
    ) {}
    // protected constructor(data : any, userIdentifier?: string) {
    //     debug(`constructor data`, data)
    //     this._graph = new Graph()
    //     this._buffer = new Buffer()
    //     this._data = data   
    //     this._userIdentifier = userIdentifier 
    
    //     if (!(c.IDENTIFIER in this._data)) {
    //         this._data[c.IDENTIFIER] = createIdentifier(this._data)
    //         this._state[Predicates.CREATED_AT] = Date.now()
    //         Object.assign(this._state, this._data);
    //         this._initialized = true
    //     } 
        
    // }

    public get $(): any {
        return this._state
    }

    public get isPending(): boolean {
        return this._isPending
    }

    preInit() {
        this._initialized = true
        this._state = this._data
    }

    initFromParent() {
        this._useParentState = true
        this._initialized = true
        this._state = this._data
    }

    async init(data : any, userIdentifier?: string): Promise<BaseEntity> {

        if (c.IDENTIFIER in this._data) {
            let state: any = []

            if (this._useBuffer && this._userIdentifier) {
                state = await this.bufferService.getLatestState(this._userIdentifier, this._data[c.IDENTIFIER])
            }

            let isPending: boolean
            if (state.length === 0) {
                const response = await this.graphService.getState(this._type, this._data[c.IDENTIFIER], 2)
                state = response[0]
                isPending = false
            } else {
                isPending = true
            }

            console.log(`IsPending: ${isPending}`)

            this._frozenState = state
            this._state = _.cloneDeep(this._frozenState)
            
            if(Object.keys(this._data).length > 1) {
                this._state = _.merge(this._data)
            }

            this._state[IS_PENDING] = isPending
            

        } else {
            Object.assign(this._state, this._data)
        }

        debug(`${this._type} state in init()`, this._state)
        // Disabled until https://ikigai-technologies.atlassian.net/browse/VULD-273 is resolved
        //SchemaService.validate(this._type, this._state)
        this._initialized = true

        return this;
      
    }

    async refresh(): Promise<VulcanBase> {
        return this.init()
    }

    async transact(vip: boolean = false): Promise<Readonly<boolean>> {
        
        return startSpan(`${this._type}-transact`,  VulcanErrorMessages.FAILED_TRANSACT_ENTITY, async () => {
            const transact = await this.prepareTransact()
            this._state[Predicates.UPDATED_AT] = Date.now()
            let success = false
            if (this._useBuffer && this._userIdentifier) {
                const hlTxCount = metrics.getMeterProvider().getMeter(OTEL_SERVICE_NAME).createCounter(HL_TX_COUNT, {
                    description: 'Count of all transactions submitted to the hot layer (RDS), including deletes and status updates.',
                    aggregationTemporality: AggregationTemporality.AGGREGATION_TEMPORALITY_DELTA
                })
                hlTxCount.bind({type: this._type}).add(1)
                success =  await this._buffer.submit({
                    startTime: Date.now(),
                    userIdentifier: this._userIdentifier,
                    entityIdentifier: this._state[IDENTIFIER],
                    originalState: this._frozenState,
                    changedState: this._state,
                    transact
                }, vip)
            } else {
                success = transact.length > 0 ? await this._graph.updateState(transact) : false
            }
            
            return success
        })()
    }

    async prepareTransact(): Promise<any[]> {
        return  startSpan(`${this._type}-prepare-transact`,  VulcanErrorMessages.FAILED_TRANSACT_ENTITY, async () => {
            if (this._useParentState) {
                throw new VulcanError(StatusCodes.NOT_ACCEPTABLE.toString(), 
                VulcanErrorMessages.DB_TRANSACT_CHILD_STATE)
            }

            if (! this._initialized) {
                await this.init()
            }

            debug('State : ', this._state)
            debug('Frozen State : ', this._frozenState)
            
            const diffTransact = this._graph.getDiffTransact(this._state, this._frozenState)
            debug('Difference : ' , diffTransact )
            
            if(diffTransact.length > 0) {
                this.sanitise(diffTransact)
                return diffTransact
            } else {
                console.log(`Nothing to update in the transaction`)
                return [];
            }
        })()
    }

    sanitise(diffTransact : any) {
        const refs = this._graph.referencedProperties(this._type)
        diffTransact.forEach(entry => {
            Object.keys(refs).forEach(ref => {
                if(Object.keys(entry).includes(ref) && typeof entry[ref] === STRING) {
                    entry[ref] = [`${refs[ref]}/${IDENTIFIER}`, entry[ref]]
                }
            })
        })
    }

    @Log(true, 'Executing search on the input params...')
    static async search(params : SearchQuery) {
        if(!params) {
            throw new VulcanError(StatusCodes.BAD_REQUEST.toString(), VulcanErrorMessages.INVALID_SEARCH_PARAMS);
        } else if(!params.filters && (params.value === undefined || String.IsNullOrWhiteSpace(params.value)) && !params.keyValue && !params.sortHeuristic) {
            throw new VulcanError(StatusCodes.BAD_REQUEST.toString(), VulcanErrorMessages.INVALID_SEARCH_CRITERIA);
        }

        return await new Graph().search(params)
    }
}

export class VulcanEmpty extends VulcanBase {
    _type: VulcanType = 'empty'

    static create(input : any): VulcanEmpty {
        return new VulcanEmpty({})
    }
}