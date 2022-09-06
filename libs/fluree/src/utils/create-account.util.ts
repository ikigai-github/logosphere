import { FlureeClient } from '@logosphere/fluree';
import { defaults } from '../fluree.constants';
import { getSinFromPublicKey } from '@fluree/crypto-utils';

/**
 * Utility function to create a root account in Fluree
 * @param client The fluree client
 * @param privateKey Root account private key
 * @returns auth id
 */
export async function createAccount(
  ledger: string,
  publicKey: string,
  role: string
) {
  const fluree = new FlureeClient({
    url: process.env.FLUREE_URL || defaults.FLUREE_URL,
    ledger,
  });

  const authId = getSinFromPublicKey(process.env.FLUREE_ROOT_PUBLIC_KEY);

  const account = await fluree.query({
    select: ['*'],
    from: '_auth',
    where: `_auth/id = '${authId}'`,
  });

  if (account && account.length === 0) {
    const result = await fluree.transact([
      {
        _id: '_auth',
        _action: 'add',
        id: authId,
        roles: [['_role/id', role]],
      },
    ]);

    if (result.status !== 200) {
      throw new Error('Failed to create root account');
    }
  }
}
