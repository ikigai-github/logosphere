/* eslint-disable @typescript-eslint/no-explicit-any */
export const messages = Object.freeze({
  TRANSACT_FAILED: 'Fluree transact failed',
  QUERY_FAILED: 'Fluree query failed',
  LIST_DBS_FAILED: 'Failed requesting list of databases',
  CREATE_DB_FAILED: 'Failed to create new database',
  INVALID_DB_FORMAT: 'Invalid database format. Should be {network}/{database}',
  LIST_LEDGERS_FAILED: 'Failed requesting list of ledgers',
  LIST_LEDGER_INFO_FAILED: 'Failed to get ledger infor for the given ledger',
  CREATE_LEDGER_FAILED: 'Failed to create a new ledger',
  DELETE_LEDGER_FAILED: 'Failed to delete the given ledger',
  COMMAND_FAILED: 'Failed to execute the supplied command',
  TX_WAIT_FAILED: 'Failed waiting for transaction to complete',
});

export class FlureeError extends Error {
  constructor(message: string, error?: any) {
    super(message);
    const details = error?.response?.data?.message ?? '';
    this.message = `${message}${details ? ': ' + details : ''}`;
  }
}
