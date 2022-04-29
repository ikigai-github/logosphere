import { LogosphereError } from '../../errors';

export const messages = Object.freeze({
  TRANSACT_FAILED: 'Fluree transact failed',
  QUERY_FAILED: 'Fluree query failed',
  LIST_DBS_FAILED: 'Failed requesting list of databases',
  CREATE_DB_FAILED: 'Failed to create new database',
  INVALID_DB_FORMAT: 'Invalid database format. Should be {network}/{database}',
});

export class FlureeError extends LogosphereError {
  constructor(message: string, error?: any) {
    const details = error?.response?.data?.message ?? '';
    super(`${message}: ${details}`, error);
  }
}
