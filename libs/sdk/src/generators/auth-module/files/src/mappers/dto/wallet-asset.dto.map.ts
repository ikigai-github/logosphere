/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { Mapper, MapperError } from '@logosphere/sdk';
import { WalletAssetDto } from '../../dto';
import { WalletAsset } from '../../entities';

@Injectable()
export class WalletAssetDtoMap extends Mapper<WalletAsset> {
  public toEntity(data: WalletAssetDto): WalletAsset {
    const walletAssetOrError = WalletAsset.create({
      id: data.id,
      subjectId: data.subjectId,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      name: this.scalar<string>(String, data['name']),
      fingerprint: this.scalar<string>(String, data['fingerprint']),
      policyId: this.scalar<string>(String, data['policyId']),
      quantity: this.scalar<number>(Number, data['quantity']),
      metadata: this.scalar<string>(String, data['metadata']),
      assetSubjectId: this.scalar<string>(String, data['assetSubjectId']),
      logosphereId: this.scalar<string>(String, data['logosphereId']),
    });
    if (walletAssetOrError.isSuccess) {
      return walletAssetOrError.getValue();
    } else {
      throw new MapperError(JSON.stringify(walletAssetOrError.error));
    }
  }

  public fromEntity(walletAsset: WalletAsset): WalletAssetDto {
    return {
      subjectId: walletAsset.subjectId,
      id: walletAsset.id,
      createdAt: walletAsset.createdAt.toISOString(),
      updatedAt: walletAsset.updatedAt.toISOString(),
      name: this.scalar<string>(String, walletAsset.name),
      fingerprint: this.scalar<string>(String, walletAsset.fingerprint),
      policyId: this.scalar<string>(String, walletAsset.policyId),
      quantity: this.scalar<number>(Number, walletAsset.quantity),
      metadata: this.scalar<string>(String, walletAsset.metadata),
      assetSubjectId: this.scalar<string>(String, walletAsset.assetSubjectId),
      logosphereId: this.scalar<string>(String, walletAsset.logosphereId),
    };
  }
}
