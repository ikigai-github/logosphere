import { FlureeTransaction } from '../transact';

import { randomBytes } from 'crypto';
import { FlureeCommand, FlureeSignableCommand } from './command.schema';
import { hash, stringify } from '../utils';

/**
 * For now a command expiry is always just 10 minutes from its creation
 */
const EXPIRY_OFFSET_MS = 10 * 60 * 1000;

/**
 * Creates a Fluree command for the given ledger and transactions
 * @param ledger The ledger the command will be run on
 * @param tx The transactions to run as part of the command
 * @param auth The identity of the party creating the transaction
 * @param deps an array of dependent transactions
 * @param fuel The maximum fuel allowed for the given command
 * @returns a Fluree Command map ready for submittal or signing
 */
export function command(
  ledger: string,
  tx: FlureeTransaction[],
  auth?: string,
  deps?: string[],
  fuel?: number
): FlureeCommand {
  return {
    type: 'tx',
    db: ledger.toLowerCase(),
    nonce: randomBytes(4).readUInt32BE(),
    txidOnly: false,
    expire: Math.floor(new Date().getTime()) + EXPIRY_OFFSET_MS,
    tx,
    auth,
    deps,
    fuel,
  };
}

/**
 * Creates a Fluree command for the given ledger and transactions, serializes it as a string, and hashes that string
 * @param ledger The ledger the command will be run on
 * @param tx The transactions to run as part of the command
 * @param auth The identity of the party creating the transaction
 * @param deps an array of dependent transactions
 * @param fuel The maximum fuel allowed for the given command
 * @returns a Fluree Command map, its serialized form, and the hash of the serialized string
 */
export function signableCommand(
  ledger: string,
  tx: FlureeTransaction[],
  auth?: string,
  deps?: string[],
  fuel?: number
): FlureeSignableCommand {
  const cmd = command(ledger, tx, auth, deps, fuel);
  const serialized = serializeCommand(cmd);
  return {
    command: cmd,
    serialized: serialized,
    hash: hash(serialized),
  };
}

/**
 * Takes a Fluree command object and serializes to a normalized string using a
 * deterministic JSON stringify function.
 * @param command The command to serialize into a string
 * @returns a normalized and serialized representation of the command
 */
export function serializeCommand(command: FlureeCommand): string {
  const { txidOnly, ...rest } = command;
  return stringify({ 'txid-only': txidOnly, ...rest }).normalize('NFKC');
}

/**
 * Converts a serialized command string back into a Fluree command map
 * @param command The serialized command string
 * @returns A Fluree command map created from deserializeing the command string
 */
export function deserializeCommand(command: string): FlureeCommand {
  const deserialized = JSON.parse(command);
  const txidOnly = deserialized['txid-only'];
  delete deserialized['txid-only'];
  return { ...deserialized, txidOnly };
}
