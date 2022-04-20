import * as fluree from '@fluree/flureenjs';

import { FlureeQuery, FlureeResult } from './fluree.schema';

export interface FlureeConfig {
  url: string;
  ledger: string;
}

export class FlureeClient {
  private connection: any;
  private connecting: Promise<any>;

  constructor(private config: FlureeConfig) {
    this.connect();
  }

  private async connect() {
    if (!this.connecting) {
      this.close();

      this.connecting = fluree
        .connect(this.config.url, {
          'keep-alive-fn': this.connect,
        })
        .then((connection) => {
          this.connection = connection;
          this.connecting = null;
        })
        .catch((error) => {
          console.error(error);
          this.connection = null;
          this.connecting = null;
        });

      return await this.connecting;
    }
  }

  async query(fql: FlureeQuery): Promise<FlureeResult> {
    const connecting = this.connecting;
    if (connecting) await connecting;

    let connection = this.connection;
    if (!connection) connection = await this.connect();

    const channel = await fluree.db(connection, this.config.ledger);
    const result = await fluree.query(channel, fql);
    return result;
  }

  close() {
    if (this.connection) {
      try {
        fluree.close(this.connection);
      } catch (error) {
        console.error(error);
      }

      this.connection = null;
    }
  }
}
