import { FlureeClient } from '@logosphere/fluree';

/**
 * Test utility function to create a empty ledger
 * @param client The fluree client that will be used to create the ledger
 * @param ledger The name of the ledger
 */
export async function createLedger(client: FlureeClient, ledger: string) {
  const ledgers = await client.listLedgers();
  if (!ledgers.includes(ledger)) {
    const createResult = await client.createLedger(ledger);
    expect(createResult.status).toBe(200);
  }

  let info = await client.ledgerInfo(ledger);
  for (let i = 0; info.status !== 'ready' && i < 3; ++i) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    info = await client.ledgerInfo(ledger);
  }

  expect(info.status).toBe('ready');
}

/**
 * Test utility function to remove a ledger
 * @param client The Fluree client that will be used to remove the ledger
 * @param ledger The name of the ledger
 */
export async function removeLedger(client: FlureeClient, ledger: string) {
  await expect(client.deleteLedger(ledger)).resolves.not.toThrow();
  await expect(client.close()).resolves.not.toThrow();
}

/**
 * Test utility funciton to create a collection with a name predicate
 * @param client
 * @param collection The name of the collection to be created
 * @returns The result of the creat transaction
 */
export async function createCollection(
  client: FlureeClient,
  collection: string
) {
  const result = await client.transact([
    {
      _id: '_collection',
      _action: 'add',
      name: collection,
    },
    {
      _id: '_predicate',
      _action: 'add',
      name: `${collection}/name`,
      type: 'string',
    },
  ]);

  return result;
}
