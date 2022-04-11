import { Injectable } from '@nestjs/common';
import { FlureeService } from '../codegen/fluree';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { FileUtil } from '../../common/file-util';
import { jsonFederatedSchemaLoader } from '../codegen/json-schema';
import { Configuration, ModuleConfiguration } from '../configuration';

@Injectable()
export class TestDataService {

  public readonly modelSchema : any; 
  public readonly fileUtil : FileUtil;

  private _config: Configuration;
  private toProcessCollections : string[];
  private collections : string[];
  private processedCollections : string[];
  private identifiers : any[] = [];
  public toInsertData : any = {}
  private pendingTransactions : any = {};
  private collectionObject = {};
  private collectionDefinitions : any[] = [];
  private modifiers : any[] = [];


  constructor( private readonly fluree: FlureeService, private readonly configService: ConfigService ) {
    //const = this.configService.get<Configuration>('modules');
    console.log(`Config From Test Data: ${JSON.stringify(this._config)}`)
    //this.modelSchema = jsonFederatedSchemaLoader();
    console.log(JSON.stringify(this.modelSchema))
    this.fileUtil = new FileUtil();
    this.toProcessCollections = [];
    this.collections = [];
    this.processedCollections = [];
    this.modifiers = [];
  }


}
