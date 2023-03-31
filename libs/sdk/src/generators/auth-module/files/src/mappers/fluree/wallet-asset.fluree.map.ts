/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { Mapper, MapperError } from '@logosphere/sdk';
import { WalletAsset } from '../../entities';

@Injectable()
export class WalletAssetFlureeMap extends Mapper<WalletAsset> {
  public toEntity(data: any): WalletAsset {
    const walletAssetOrError = WalletAsset.create({
      id: data['walletAsset/identifier'] || data.identifier,
      subjectId: String(data._id),
      createdAt: new Date(data['walletAsset/createdAt'] || data.createdAt),
      updatedAt: new Date(data['walletAsset/updatedAt'] || data.updatedAt),
      name: this.scalar<string>(String, data['walletAsset/name'] || data.name),
      fingerprint: this.scalar<string>(
        String,
        data['walletAsset/fingerprint'] || data.fingerprint
      ),
      policyId: this.scalar<string>(
        String,
        data['walletAsset/policyId'] || data.policyId
      ),
      quantity: this.scalar<number>(
        Number,
        data['walletAsset/quantity'] || data.quantity
      ),
      metadata: this.scalar<string>(
        String,
        data['walletAsset/metadata'] || data.metadata
      ),
      assetSubjectId: this.scalar<string>(
        String,
        data['walletAsset/assetSubjectId'] || data.assetSubjectId
      ),
      logosphereId: this.scalar<string>(
        String,
        data['walletAsset/logosphereId'] || data.logosphereId
      ),
    });
    if (walletAssetOrError.isSuccess) {
      return walletAssetOrError.getValue();
    } else {
      throw new MapperError(JSON.stringify(walletAssetOrError.error));
    }
  }

  public fromEntity(walletAsset: WalletAsset): any {
    return {
      _id: walletAsset.subjectId
        ? Number(walletAsset.subjectId)
        : `walletAsset$${walletAsset.id}`,
      'walletAsset/identifier': walletAsset.id,
      'walletAsset/createdAt': Number(walletAsset.createdAt),
      'walletAsset/updatedAt': Number(walletAsset.updatedAt),
      'walletAsset/name': this.scalar<string>(String, walletAsset.name),
      'walletAsset/fingerprint': this.scalar<string>(
        String,
        walletAsset.fingerprint
      ),
      'walletAsset/policyId': this.scalar<string>(String, walletAsset.policyId),
      'walletAsset/quantity': this.scalar<number>(Number, walletAsset.quantity),
      'walletAsset/metadata': this.scalar<string>(String, walletAsset.metadata),
      'walletAsset/assetSubjectId': this.scalar<string>(
        String,
        walletAsset.assetSubjectId
      ),
      'walletAsset/logosphereId': this.scalar<string>(
        String,
        walletAsset.logosphereId
      ),
    };
  }
}
