import { FlureeClient } from '../fluree.client';
import { FlureeError, messages } from '../fluree.errors';
import { defaults } from '../fluree.constants';

export async function createLedger(ledger: string) {
  const fluree = new FlureeClient({
    url: process.env.FLUREE_URL || defaults.FLUREE_URL,
    ledger,
  });
  const ledgers = await fluree.listLedgers();
  if (!ledgers.find((l: string) => l === ledger)) {
    console.log(`Creating Fluree ${ledger} ledger for the module`);
    const response = await fluree.createLedger(ledger);
    for (let i = 0; i < 5; i++) {
      process.stdout.write('.');
      await new Promise((f) => setTimeout(f, 1000));
    }
    process.stdout.write('\n');

    if (response.status !== 200) {
      throw new FlureeError(messages.CREATE_LEDGER_FAILED);
    } else {
      console.log(`Ledger ${ledger} created`);
    }
  }
}
