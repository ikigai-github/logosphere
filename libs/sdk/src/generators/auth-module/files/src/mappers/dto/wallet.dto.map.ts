/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { Mapper, MapperError } from '@logosphere/sdk';
import { WalletDto } from '../../dto';
import { Wallet, WalletAsset } from '../../entities';
import { WalletAssetDtoMap } from './wallet-asset.dto.map';

@Injectable()
export class WalletDtoMap extends Mapper<Wallet> {
  public toEntity(data: WalletDto): Wallet {
    const walletOrError = Wallet.create({
      id: data.id,
      subjectId: data.subjectId,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      name: this.scalar<string>(String, data['name']),
      walletId: this.scalar<string>(String, data['walletId']),
      address: this.scalar<string>(String, data['address']),
      publicKey: this.scalar<string>(String, data['publicKey']),
      policyId: this.scalar<string>(String, data['policyId']),
      balance: this.scalar<number>(Number, data['balance']),
      assets: this.objectArrayToEntity<WalletAsset, WalletAssetDtoMap>(
        WalletAssetDtoMap,
        data['assets']
      ),
    });
    if (walletOrError.isSuccess) {
      return walletOrError.getValue();
    } else {
      throw new MapperError(JSON.stringify(walletOrError.error));
    }
  }

  public fromEntity(wallet: Wallet): WalletDto {
    return {
      subjectId: wallet.subjectId,
      id: wallet.id,
      createdAt: wallet.createdAt.toISOString(),
      updatedAt: wallet.updatedAt.toISOString(),
      name: this.scalar<string>(String, wallet.name),
      walletId: this.scalar<string>(String, wallet.walletId),
      address: this.scalar<string>(String, wallet.address),
      publicKey: this.scalar<string>(String, wallet.publicKey),
      policyId: this.scalar<string>(String, wallet.policyId),
      balance: this.scalar<number>(Number, wallet.balance),
      assets: this.entityArrayToData<WalletAsset, WalletAssetDtoMap>(
        WalletAssetDtoMap,
        wallet.assets
      ),
    };
  }
}
