import { FlureeClient } from '@logosphere/fluree';
import { account_id_from_public } from '@fluree/crypto-base';
import { createECDH } from 'crypto';

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

  expect(result.status).toBe(200);
  return result;
}

/**
 * Utility function to create an account in Fluree
 * @param client The fluree client that will be used to create the account
 * @returns The public-private key pair and the auth id created from the public key
 */
export async function createAccount(client: FlureeClient) {
  const ecdh = createECDH('secp256k1');
  ecdh.generateKeys();
  const priv = ecdh.getPrivateKey('hex');
  const pub = ecdh.getPublicKey('hex', 'compressed');
  const auth = account_id_from_public(pub);

  const result = await client.transact([
    {
      _id: '_auth',
      _action: 'add',
      id: auth,
      doc: 'A temp auth record',
      roles: [['_role/id', 'root']],
    },
  ]);

  expect(result.status).toBe(200);

  return {
    priv,
    pub,
    auth,
  };
}
