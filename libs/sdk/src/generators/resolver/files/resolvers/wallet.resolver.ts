/* eslint-disable @typescript-eslint/no-explicit-any */
import { Args, ID, Mutation, Query, Resolver, Info } from '@nestjs/graphql';
import { WalletDto, KeysDto } from '../dto/wallet.dto';
import { CardanoWalletService } from '@logosphere/cardano';
@Resolver()
export class WalletResolver {
  constructor(private walletService: CardanoWalletService) {}

  @Mutation(() => WalletDto)
  async createWallet(
    @Args({ name: 'name', type: () => String })
    name: string,
    @Args({ name: 'passphrase', type: () => String })
    passphrase: string
  ): Promise<WalletDto> {
    const wallet = await this.walletService.createWallet(name, passphrase);

    return {
      name,
      passphrase,
      id: wallet.id,
      privateKey: wallet.privateKey,
      publicKey: wallet.publicKey,
      mnemonic: wallet.mnemonic,
      address: wallet.address,
    };
  }

  @Mutation(() => WalletDto)
  async createWalletFromPubKey(
    @Args({ name: 'username', type: () => String })
    username: string,
    @Args({ name: 'cardanoPublicKey', type: () => String })
    cardanoPublicKey: string
  ): Promise<WalletDto> {
    const wallet = await this.walletService.createWalletFromPubKey(
      `${username} wallet`, 
      cardanoPublicKey
    );

    return {
      name: wallet.name,
      id: wallet.id,
      publicKey: wallet.publicKey,
      address: wallet.address,
    };
  }


  @Query()
  async getWalletBalance(
    @Args({ name: 'walletId', type: () => String })
    walletId: string
  ): Promise<number> {
    return await this.walletService.getAccountBalance(walletId);
  }

  @Query()
  async getWallet(
    @Args({ name: 'walletId', type: () => String })
    walletId: string,
    @Args({ name: 'mnemonic', type: () => String })
    mnemonic: string
  ): Promise<WalletDto> {
    const wallet = await this.walletService.getCardanoWallet(
      walletId,
      mnemonic
    );

    return {
      id: wallet.id,
      name: wallet.name,
      address: wallet.address,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      mnemonic,
    };
  }

  @Query()
  async generateKeys(): Promise<KeysDto>  {
    return this.walletService.generateKeys();
  }

  @Mutation(() => String)
  async submitTx(
    @Args({ name: 'txCborHex', type: () => String })
    txCborHex: string
  ): Promise<string> {
    return await this.walletService.submitTx(txCborHex)
    
  }
}
