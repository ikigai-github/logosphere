import { WalletAssetDto } from './wallet-asset.dto';

export class WalletDto {
  id?: string;
  subjectId?: string;
  createdAt?: string;
  updatedAt?: string;
  name?: string;
  walletId?: string;
  address?: string;
  publicKey?: string;
  policyId?: string;
  balance?: number;
  assets?: WalletAssetDto[];
}
