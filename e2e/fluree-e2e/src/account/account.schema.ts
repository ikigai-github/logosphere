import { FlureeClient } from '@logosphere/fluree';
import { account_id_from_private } from '@fluree/crypto-base';
import { createECDH } from 'crypto';

/**
 * Everything could be derived from the private key but
 * returing public key and account id as well for test.
 */
export interface FlureeAccount {
  publicKey: string;
  privateKey: string;
  authId: string;
}

/**
 * Utility function to create an account in Fluree
 * @param client The fluree client that will be used to create the account
 * @returns The public-private key pair and the auth id created from the public key
 */
export async function createAccount(
  client: FlureeClient
): Promise<FlureeAccount> {
  const ecdh = createECDH('secp256k1');
  ecdh.generateKeys();
  const privateKey = ecdh.getPrivateKey('hex');

  const publicKey = ecdh.getPublicKey('hex', 'compressed');

  // Tried to replicate https://github.com/fluree/fluree.crypto/blob/bf783375ea5dfc39f137a8055909ba1a915f2791/src/fluree/crypto/secp256k1.cljc#L110
  // to better understand how authId is created but couldn't get it to match up.
  // const keyHash = createHash('sha256').update(ecdh.getPublicKey()).digest();
  // const prefixedHash = Buffer.concat([ Buffer.from([0x0F, 0x02]), keyHash]);
  // const checksum = createHash('sha56').update(createHash('sha256').update(prefixedHash).digest()).digest().slice(0,4);
  // const authIdBuffer = Buffer.concat([prefixed, checksum]);
  // const myAuthId = base58(authIdBuffer);

  const authId = account_id_from_private(process.env.FLUREE_SIGNING_KEY); //account_id_from_public(publicKey);
  console.log(`Auth ID: ${authId}`);

  const result = await client.transact([
    {
      _id: '_auth',
      _action: 'add',
      id: authId,
      doc: 'A temp auth record',
      roles: [['_role/id', 'root']],
    },
  ]);

  if (result.status !== 200) {
    throw new Error('Failed to create account');
  }

  return {
    privateKey,
    publicKey,
    authId,
  };
}
