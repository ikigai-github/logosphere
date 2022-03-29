import _ from 'lodash';
import { Injectable } from '@nestjs/common';
import { String } from 'typescript-string-operations';
import { FlureeService, predicates as p } from '../fluree';
import { difference } from './difference';
import { SearchQuery } from '../../search';
import { 
  CanonicalSchema, 
  Definition, 
  Property,
  DefinitionType
} from '../../codegen';
import { Log } from '../../decorators';
import { constants as c } from './graph.constants';



/**
* Service for operating on graph objects
*/
@Injectable()
export class GraphService {

  constructor( private readonly flureeService: FlureeService) {}

  /**
   * Builds a state query recursively from JSON schema
   * @param schema : canonical schema of the bounded context
   * @param entityType : entity type of the starting node
   * @param select : select clause in FlureeQL
   * @param maxLevels : maximum level of recursion
   * @param currentLevel : current level of recursion
   */

  public buildStateQuery(schema: CanonicalSchema, entityType: string,  select: any[],  maxLevels: number, currentLevel: number = 0) {
    const def: Definition = schema.definitions.find((def: Definition) => def.name === entityType);
   
    def.props.map((prop: Property) => {
      if ((prop.defType === DefinitionType.Entity ||
          prop.defType === DefinitionType.EntityArray) &&
          (currentLevel <= maxLevels)) {
        const subSelect = {};
        subSelect[prop.name] = [];
        select.push(subSelect);
        this.buildStateQuery(schema, prop.type, subSelect[prop.name], maxLevels, currentLevel+1);
      } else {
        select.push(prop.name)
      }
    });
  }

  /**
     * Gets state of the graph, by crawling it recursively
     * @param endpoint : Fluree endpoint URL
     * @param db: Fluree database in the format of {network}/{db}
     * @param schema : canonical schema
     * @param type : type of starting node
     * @param identifier : identifier of the starting node
     * @param depth : depth of recursion
     * @returns : state graph in the JSON format
     */
  @Log(true, 'Getting persisted state from the database')
  public async getState(
    endpoint: string, 
    db: string, schema: 
    CanonicalSchema, type: 
    string, identifier: 
    string, depth = 0, 
    identifierType? : string): Promise<any> {
    const query = {};
    query[c.SELECT] = [];
    
    String.IsNullOrWhiteSpace(identifier) ? query[c.FROM] = type : 
      identifierType ? query[c.FROM] = [`${type}/${identifierType}`, identifier] : query[c.FROM] = [`${type}/${c.IDENTIFIER}`, identifier];
    
    this.buildStateQuery(schema, type, query[c.SELECT], depth);

    const response = await this.flureeService.query(endpoint, db, query)
    const state = response

    //debug('State:', state)
    return Object.freeze(state)
  }

  @Log(true, 'Getting persisted state from Database')
  public async query(endpoint: string, db: string, query: string): Promise<any> {
    const state = await this.flureeService.query(endpoint, db, query);
    return Object.freeze(state);
  }

  @Log(true, 'Searching records from Database')
  public async search(param : SearchQuery): Promise<any> {
      
    if(param.subject && !String.IsNullOrWhiteSpace(param.subject)) {
        //perform search on a specific collection
        return await this.find(param)
    } else {
        //perform collection wide search
        let results : any[] = []
        for await (const collection of this.collections) {
            param.subject = collection
            param.fuzzy = true
            const searchResult = await this.find(param)
            if(searchResult.length > 0) {
                results.push({[collection] : searchResult})
            }
        }
        return results
    }

  }
}