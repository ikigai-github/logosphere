/* eslint-disable @typescript-eslint/no-empty-interface */
import { Repository } from '@logosphere/sdk';
import { Wallet } from '../../entities';

export interface IWalletRepository extends Repository<Wallet> {
  findOneByWalletId(walletId: string): Promise<Wallet>;
  findOneByAddress(address: string): Promise<Wallet>;
  findOneByPublicKey(publicKey: string): Promise<Wallet>;
  findOneByPolicyId(policyId: string): Promise<Wallet>;
}
