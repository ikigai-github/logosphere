/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { Mapper, MapperError } from '@logosphere/sdk';
import { User, Wallet } from '../../entities';
import { WalletFlureeMap } from './wallet.fluree.map';

@Injectable()
export class UserFlureeMap extends Mapper<User> {
  public toEntity(data: any): User {
    const userOrError = User.create({
      id: data['user/identifier'] || data.identifier,
      subjectId: String(data._id),
      createdAt: new Date(data['user/createdAt'] || data.createdAt),
      updatedAt: new Date(data['user/updatedAt'] || data.updatedAt),
      username: this.scalar<string>(
        String,
        data['user/username'] || data.username
      ),
      wallet: this.objectToEntity<Wallet, WalletFlureeMap>(
        WalletFlureeMap,
        data['user/wallet'] || data.wallet
      ),
    });
    if (userOrError.isSuccess) {
      return userOrError.getValue();
    } else {
      throw new MapperError(JSON.stringify(userOrError.error));
    }
  }

  public fromEntity(user: User): any {
    return {
      _id: user.subjectId ? Number(user.subjectId) : `user$${user.id}`,
      'user/identifier': user.id,
      'user/createdAt': Number(user.createdAt),
      'user/updatedAt': Number(user.updatedAt),
      'user/username': this.scalar<string>(String, user.username),
      'user/wallet': this.entityToData<Wallet, WalletFlureeMap>(
        WalletFlureeMap,
        user.wallet
      ),
    };
  }
}
