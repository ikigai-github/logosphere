/* eslint-disable @typescript-eslint/no-explicit-any */
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { UserAuthDto, WalletDto } from '../dto';
import { User, Wallet } from '../entities';
import { WalletDtoMap } from '../mappers/dto';
import { LogosphereError } from '@logosphere/sdk';
import { 
  UserFlureeRepository, 
  UserAuthFlureeRepository, 
  WalletFlureeRepository 
} from '../repositories/fluree';
import { CardanoWalletService } from '@logosphere/cardano';

@Resolver()
export class UserAuthResolver {
  constructor(
    private repo: UserAuthFlureeRepository,
    private userRepo: UserFlureeRepository,
    private walletRepo: WalletFlureeRepository,
    private mapper: WalletDtoMap,
    private walletService: CardanoWalletService
  ) {}

  @Mutation(() => UserAuthDto)
  async createUserAuth(
    @Args({ name: 'username', type: () => String })
    username: string,

    @Args({ name: 'cardanoPublicKey', type: () => String })
    cardanoPublicKey: string,

    @Args({ name: 'role', type: () => String })
    role: string
  ): Promise<UserAuthDto> {
    const authId = await this.repo.createUserAuth(cardanoPublicKey, role);

    return {
      username,
      cardanoPublicKey,
      authId,
    };
  }

  @Mutation(() => String)
  async createPassword(
    @Args({ name: 'username', type: () => String })
    username: string,

    @Args({ name: 'password', type: () => String })
    password: string
  ): Promise<string> {
    const token = await this.repo.createPassword(username, password);

    return token;
  }

  @Mutation(() => UserAuthDto)
  async createUser(
    @Args({ name: 'username', type: () => String })
    username: string,
    @Args({ name: 'password', type: () => String })
    password: string,
    @Args({ name: 'role', type: () => String })
    role: string
  ): Promise<UserAuthDto> {
    const token = await this.repo.createUser(username, password, role);
    const user = User.create({ username }).getValue();
    await this.userRepo.save(user);

    return {
      username,
      token,
    };
  }

  @Query(() => String)
  async getLastTxId(
    @Args({ name: 'username', type: () => String })
    username: string
  ): Promise<string> {

    const user =  await this.userRepo.findOneByUsername(username, [
      'id',
      'username',
      'wallet',
      'wallet/id',
      'wallet/subjectId',
      'wallet/walletId'
    ]);

    if (! (user.wallet && user.wallet.walletId)) {
      throw new LogosphereError(`Wallet ID not found for user ${username}`)
    }

    const shelleyWallet = await this.walletService.getWallet(user.wallet.walletId);
    const transactions = await shelleyWallet.getTransactions();

    return (transactions && transactions.length > 0) 
      ? transactions[0].id 
      : '';
  }

  @Query(() => String)
  async loginUser(
    @Args({ name: 'username', type: () => String })
    username: string,
    @Args({ name: 'password', type: () => String })
    password: string
  ): Promise<UserAuthDto> {
    const token = await this.repo.loginUser(username, password);
    return {
      username,
      token
    }
  }

  @Query(() => String)
  async getUserWallet(
    @Args({ name: 'username', type: () => String })
    username: string
  ): Promise<WalletDto> {
    const user = await this.userRepo.findOneByUsername(username);
    const wallet = await this.walletRepo.findOneBySubjectId(user.wallet.subjectId, [
      'id',
      'subjectId',
      'walletId',
      'address',
      'publicKey',
      'assets',
      'assets/id',
      'assets/subjectId',
      'assets/metadata',
      'assets/name',
      'assets/policyId',
      'assets/logosphereId',
      'assets/assetSubjectId',
      'assets/quantity',
      'assets/createdAt',
      'assets/updatedAt',
    ]);

    // remove assets that are not in the wallet, because they are not minted yet or because they've been moved
    // out of the wallet

    const filteredAssets = [];
    if (wallet.assets && wallet.assets.length > 0) {
      const shelleyWallet = await this.walletService.getWallet(wallet.walletId);
      wallet.assets.map((asset) => {
        if (shelleyWallet.assets.available.find((shelleyWalletAsset) => asset.policyId === shelleyWalletAsset.policy_id)) {
          filteredAssets.push(asset);
        }
      });
    } 

    const balance = await this.walletService.getAccountBalance(wallet.walletId);

    const walletDto = this.mapper.fromEntity(wallet);

    return {
      ...walletDto,
      balance,
      assets: filteredAssets
    }

  }  
}
