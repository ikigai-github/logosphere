import * as fluree from '@fluree/flureenjs';
import { flureeConfig, FlureeConfig } from './fluree.config';
import { FlureeError, messages } from './fluree.errors';
import { FlureeQuery } from './fluree.query.schema';
import { FlureeTransaction } from './fluree.transact.schema';

import {
  FlureeCreateLedgerResponse,
  FlureeDeleteLedgerResponse,
  FlureeLedgerInfoResponse,
  FlureeListLedgerResponse,
  FlureeQueryResponse,
  FlureeTransactionResponse,
} from './fluree-response.interface';
import { processFlureeDuration } from './fluree.util';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class FlureeClient {
  #connection: any;
  #connecting: Promise<any>;
  #config: FlureeConfig;

  /**
   * Automatically tries to connect to the database to fail fast if confiration is invalid.
   * @param config The fluree database connection config
   */
  constructor(
    @Inject(flureeConfig.KEY) config: ConfigType<typeof flureeConfig>
  ) {
    this.#config = config;
    this.reconnect();
  }

  /**
   * If a connection isn't being established this function will close any open connection
   * and establish a new connection.
   * @returns A promise that will resul
   */
  private async reconnect() {
    const connecting = this.#connecting;
    if (!connecting) {
      this.close();

      this.#connecting = fluree
        .connect(this.#config.url, {
          'keep-alive-fn': this.reconnect,
        })
        .then((connection) => {
          this.#connection = connection;
          this.#connecting = null;
          return connection;
        })
        .catch((error) => {
          console.error(error);
          this.#connection = null;
          this.#connecting = null;
        });

      return this.#connecting;
    }

    return connecting;
  }

  /**
   * Returns the active connection. If there is no connection attempts to establish one.
   * @returns The current active connection
   */
  private async connection() {
    let connection = this.#connection;
    if (!connection) connection = await this.reconnect();
    return connection;
  }

  /**
   * Fetches a list of ledgers assocated with the current connection
   * @returns An array of ledger names
   */
  async listLedgers(): Promise<FlureeListLedgerResponse> {
    try {
      const connection = await this.connection();
      const response = await fluree.ledgerList(connection);
      return response.map((tuple: string[]) => {
        return tuple.join('/');
      });
    } catch (error: any) {
      throw new FlureeError(messages.LIST_LEDGERS_FAILED, error);
    }
  }

  /**
   * fetches detailed information about the given ledger
   * @param ledger The name of the ledger to get information for
   * @returns Detailed ledger information for the given ledger.
   */
  async ledgerInfo(ledger: string): Promise<FlureeLedgerInfoResponse> {
    try {
      const connection = await this.connection();
      return await fluree.ledgerInfo(connection, ledger);
    } catch (error: any) {
      throw new FlureeError(messages.LIST_LEDGER_INFO_FAILED, error);
    }
  }

  /**
   * Creates a ledger by name and returns the result of that ledger creation.
   * @param ledger The name of the ledger to be created
   * @returns The result information associated with creating the ledger
   */
  async createLedger(ledger: string): Promise<FlureeCreateLedgerResponse> {
    if (ledger.split('/').length !== 2) {
      throw new FlureeError(messages.INVALID_DB_FORMAT);
    }

    try {
      const connection = await this.connection();
      return await fluree.newLedger(connection, ledger);
    } catch (error: any) {
      throw new FlureeError(messages.CREATE_LEDGER_FAILED, error);
    }
  }

  /**
   * Deletes a ledger by name and returns the result of deleting the ledger
   * @param ledger the name of the ledger to be deleted
   * @returns The result information associated with deleting the ledger
   */
  async deleteLedger(ledger: string): Promise<FlureeDeleteLedgerResponse> {
    if (ledger.split('/').length !== 2) {
      throw new FlureeError(messages.INVALID_DB_FORMAT);
    }

    try {
      const connection = await this.connection();
      return await fluree.deleteLedger(connection, ledger);
    } catch (error: any) {
      throw new FlureeError(messages.DELETE_LEDGER_FAILED, error);
    }
  }

  /**
   * Takes a FlureeQL query object and runs the query against fluree.
   * @param fql A FlureQL query object
   * @returns The results mataching the given query.
   */
  async query<T extends FlureeQuery>(fql: T): Promise<FlureeQueryResponse> {
    try {
      const connection = await this.connection();
      const channel = await fluree.db(connection, this.#config.ledger);
      return await fluree.query(channel, fql);
    } catch (error: any) {
      throw new FlureeError(messages.QUERY_FAILED, error);
    }
  }

  /**
   * Takes an array of transactions and runs them. Use the command
   * endpoint instead of the transaction is not going to be signed by
   * Fluree or by a private key held by the service.
   * @param tx An array of Fluree transactons to run
   * @param opts Optional c
   * @returns The result of the transaction
   */
  async transact<T extends FlureeTransaction>(
    tx: T[],
    opts?: object
  ): Promise<FlureeTransactionResponse> {
    const connection = await this.connection();
    const response = await fluree.transact(
      connection,
      this.#config.ledger,
      tx,
      opts
    );

    return {
      transactionId: response.id,
      blockNumber: response.block,
      blockHash: response.hash,
      timestamp: response.instant,
      duration: processFlureeDuration(response.duration),
      fuel: response.fuel,
      auth: response.auth,
      status: response.status,
      bytes: response.bytes,
      flakes: response.flakes.length,
    };
  }

  /**
   * Closes the connection to fluree
   */
  async close() {
    if (this.#connection) {
      try {
        await fluree.close(this.#connection);
      } catch (error) {
        console.error(error);
      }

      this.#connection = null;
    }
  }
}
