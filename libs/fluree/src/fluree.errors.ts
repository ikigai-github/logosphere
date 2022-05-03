import { LogosphereError } from '@logosphere/errors'

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
});

export class FlureeError extends LogosphereError {
  constructor(message: string, error?: any) {
    const details = error?.response?.data?.message ?? '';
    super(`${message}: ${details}`, error);
  }
}
