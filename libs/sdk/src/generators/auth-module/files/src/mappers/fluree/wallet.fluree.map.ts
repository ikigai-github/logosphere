/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { Mapper, MapperError } from '@logosphere/sdk';
import { Wallet, WalletAsset } from '../../entities';
import { WalletAssetFlureeMap } from './wallet-asset.fluree.map';

@Injectable()
export class WalletFlureeMap extends Mapper<Wallet> {
  public toEntity(data: any): Wallet {
    const walletOrError = Wallet.create({
      id: data['wallet/identifier'] || data.identifier,
      subjectId: String(data._id),
      createdAt: new Date(data['wallet/createdAt'] || data.createdAt),
      updatedAt: new Date(data['wallet/updatedAt'] || data.updatedAt),
      name: this.scalar<string>(String, data['wallet/name'] || data.name),
      walletId: this.scalar<string>(
        String,
        data['wallet/walletId'] || data.walletId
      ),
      address: this.scalar<string>(
        String,
        data['wallet/address'] || data.address
      ),
      publicKey: this.scalar<string>(
        String,
        data['wallet/publicKey'] || data.publicKey
      ),
      policyId: this.scalar<string>(
        String,
        data['wallet/policyId'] || data.policyId
      ),
      balance: this.scalar<number>(
        Number,
        data['wallet/balance'] || data.balance
      ),
      assets: this.objectArrayToEntity<WalletAsset, WalletAssetFlureeMap>(
        WalletAssetFlureeMap,
        data['wallet/assets'] || data.assets
      ),
    });
    if (walletOrError.isSuccess) {
      return walletOrError.getValue();
    } else {
      throw new MapperError(JSON.stringify(walletOrError.error));
    }
  }

  public fromEntity(wallet: Wallet): any {
    return {
      _id: wallet.subjectId ? Number(wallet.subjectId) : `wallet$${wallet.id}`,
      'wallet/identifier': wallet.id,
      'wallet/createdAt': Number(wallet.createdAt),
      'wallet/updatedAt': Number(wallet.updatedAt),
      'wallet/name': this.scalar<string>(String, wallet.name),
      'wallet/walletId': this.scalar<string>(String, wallet.walletId),
      'wallet/address': this.scalar<string>(String, wallet.address),
      'wallet/publicKey': this.scalar<string>(String, wallet.publicKey),
      'wallet/policyId': this.scalar<string>(String, wallet.policyId),
      'wallet/balance': this.scalar<number>(Number, wallet.balance),
      'wallet/assets': this.entityArrayToData<
        WalletAsset,
        WalletAssetFlureeMap
      >(WalletAssetFlureeMap, wallet.assets),
    };
  }
}
