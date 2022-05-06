import { FlureeTransaction } from '../transact';

/**
 * A command prepared to be submitted to fluree
 */
export interface FlureeCommand {
  type: 'tx';
  db: string;
  tx: FlureeTransaction[];
  auth?: string;
  fuel?: number;
  nonce: number;
  expire: number;
  txidOnly: boolean;
  deps: string[];
}

/**
 * A command ready for signing that should be sent to the client
 */
export interface FlureeSignableCommand {
  command: FlureeCommand;
  serialized: string;
  hash: string;
}

/**
 * A command ready for signing that should be sent to the client
 */
export interface FlureeCommandHash {
  command: string;
  hash: string;
}

/**
 * A signed hash of a stringified command
 */
export interface FlureeSignedCommand {
  hash: string;
  signature: string;
}
