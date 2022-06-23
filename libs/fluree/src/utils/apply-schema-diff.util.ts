import * as fs from 'fs-extra';
import { createLedger } from '../utils';
import { defaults as fd } from '../fluree.constants';
import { FlureeClient } from '../fluree.client';
import { FlureeError, messages } from '../fluree.errors';
import {
  FlureeSchema,
  schemaLoader,
  schemaDiff,
  schemaTransact,
} from '../schema';

export async function applySchemaDiff(ledger: string, schema: FlureeSchema) {
  if (!!process.env.FLUREE_AUTO_UPDATE_SCHEMA || false) {
    // TODO: Make more elaborate check if schema can be updated
    // i.e. check that the host is the leader in the transact group, etc.
    // https://ikigai-technologies.atlassian.net/browse/LOG-197
    await createLedger(ledger);
    const ledgerSchema = await schemaLoader(ledger);
    const diffSchema = schemaDiff(ledgerSchema, schema);
    console.log('Updating ledger schema');
    const fluree = new FlureeClient({
      url: process.env.FLUREE_URL || fd.FLUREE_URL,
      ledger,
    });
    const response = await fluree.transactRaw(schemaTransact(diffSchema));
    if (response.status === 200) {
      console.log('Fluree ledger schema has been updated');
    } else {
      throw new FlureeError(messages.TRANSACT_FAILED);
    }
  }
}

export async function applySchemaDiffFromFile(
  ledger: string,
  schemaPath: string
) {
  if (fs.existsSync(schemaPath)) {
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));
    await applySchemaDiff(ledger, schema);
  }
}
