import axios from 'axios';
import { Injectable } from '@nestjs/common';
// import { ConfigModule, ConfigService } from '@nestjs/config';
import { messages as m, FlureeError } from './fluree.errors';
import { FlureeResponse } from './fluree-response.interface';
import { api } from './fluree.api';
//import { Configuration, ModuleConfiguration } from '../../configuration';

/**
 * Service for interacting with Fluree DB instance
 */
@Injectable()
export class FlureeService {
  /**
   * Fluree returns duration as string (i.e 15ms)
   * This converts it to integer number of milliseconds
   * @param duration : duration in format of 15ms, 15s, 15m, 15h etc
   * @returns duration as number of milliseconds
   */
  #processDuration(duration: string): number {
    if (duration.indexOf('ms') > 0) {
      return +duration.replace('ms', '');
    } else if (duration.indexOf('s') > 0) {
      return +duration.replace('s', '') * 1000;
    } else if (duration.indexOf('m') > 0) {
      return +duration.replace('m', '') * 1000 * 60;
    } else if (duration.indexOf('h') > 0) {
      return +duration.replace('h', '') * 1000 * 60 * 60;
    } else {
      return 0
    }
  }

  //private _config: Configuration;

  // constructor(private readonly configService: ConfigService) {
  //   this._config = this.configService.get<Configuration>('config');

  // }

  /**
   * Lists databases (ledgers) in the Fluree endpoint
   * @param endpoint : Fluree endpoint URL (http://localhost:8090)
   * @returns array of databases in the format [{network}/{database}]
   */
  async listDBs(endpoint: string): Promise<string[]> {
    //const mod = this._config.modules.find((m: ModuleConfiguration) => m.name === module);
    try {
      const response = await axios.post(api(endpoint).listDbs);
      const dbs: string[][] = response.data;
      return dbs.map((db: string[]) => {
        return db.join('/');
      });
    } catch (error: any) {
      throw new FlureeError(m.LIST_DBS_FAILED, error);
    }
  }

  /**
   * Creates new database (ledger)
   * @param endpoint : Fluree endpoint URL (http://localhost:8090)
   * @param db : name of the database in format {network}/{database}
   * @returns : ID of the database
   */
  async createDB(endpoint: string, db: string): Promise<string> {
    if (db.split('/').length !== 2) {
      throw new FlureeError(m.INVALID_DB_FORMAT);
    }

    try {
      const response = await axios.post(api(endpoint).newDb, { 'db/id': db });
      return response.data;
    } catch (error: any) {
      throw new FlureeError(m.CREATE_DB_FAILED, error);
    }
  }

  /**
   * Creates new transaction. Only works against open API (no signatures required)
   * @param endpoint : Fluree endpoint URL (http://localhost:8090)
   * @param db : name of the database in format {network}/{database}
   * @param transact : Valid FQL transact JSON, i.e [{_id: "_collection", name: "sample_collection"}]
   * @returns FlureeResponse object with data about posted transactions
   */
  async transact(
    endpoint: string,
    db: string,
    transact: any
  ): Promise<Readonly<FlureeResponse>> {
    if (db.split('/').length !== 2) {
      throw new FlureeError(m.INVALID_DB_FORMAT);
    }

    try {
      //const mod = this._config.modules.find((m: ModuleConfiguration) => m.name === module);

      if (typeof transact === 'string') {
        transact = JSON.parse(transact);
      }

      const response = await axios.post(api(endpoint, db).transact, transact);

      /*
       */
      return {
        transactionId: response.data.id,
        blockNumber: response.data.block,
        blockHash: response.data.hash,
        timestamp: response.data.instant,
        duration: this.#processDuration(response.data.duration),
        fuel: response.data.fuel,
        auth: response.data.auth,
        status: response.status,
        bytes: response.data.bytes,
        flakes: response.data.flakes.length,
      };
    } catch (error: any) {
      throw new FlureeError(
        `${m.TRANSACT_FAILED}: ${JSON.stringify(transact)}`,
        error
      );
    }
  }

  /**
   *
   * @param endpoint : Fluree endpoint URL (http://localhost:8090)
   * @param db : name of the database in format {network}/{database}
   * @param query : valid FQL query JSON
   */
  async query(endpoint: string, db: string, query: any): Promise<any> {
    try {
      const response = await axios.post(api(endpoint, db).query, query);
      return response.data;
    } catch (error: any) {
      throw new FlureeError(`m.QUERY_FAILED: ${JSON.stringify(query)}`, error);
    }
  }
}
