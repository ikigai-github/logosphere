/* eslint-disable @typescript-eslint/no-empty-interface */
import { Repository } from '@logosphere/sdk';
import { WalletAsset } from '../../entities';

export interface IWalletAssetRepository extends Repository<WalletAsset> {}
