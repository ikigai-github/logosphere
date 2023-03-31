/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@nestjs/common';
import { Mapper, MapperError } from '@logosphere/sdk';
import { UserDto } from '../../dto';
import { User, Wallet } from '../../entities';
import { WalletDtoMap } from './wallet.dto.map';

@Injectable()
export class UserDtoMap extends Mapper<User> {
  public toEntity(data: UserDto): User {
    const userOrError = User.create({
      id: data.id,
      subjectId: data.subjectId,
      createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
      updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date(),
      username: this.scalar<string>(String, data['username']),
      wallet: this.objectToEntity<Wallet, WalletDtoMap>(
        WalletDtoMap,
        data['wallet']
      ),
    });
    if (userOrError.isSuccess) {
      return userOrError.getValue();
    } else {
      throw new MapperError(JSON.stringify(userOrError.error));
    }
  }

  public fromEntity(user: User): UserDto {
    return {
      subjectId: user.subjectId,
      id: user.id,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
      username: this.scalar<string>(String, user.username),
      wallet: this.entityToData<Wallet, WalletDtoMap>(
        WalletDtoMap,
        user.wallet
      ),
    };
  }
}
