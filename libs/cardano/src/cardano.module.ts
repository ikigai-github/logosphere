import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CardanoWalletService, cardanoWalletConfig } from './cardano-wallet';
import { MintingService } from './lucid';
import { MintService } from './mint/mint.service';

@Module({
  imports: [ConfigModule.forFeature(cardanoWalletConfig)],
  providers: [CardanoWalletService, MintService, MintingService],
  exports: [CardanoWalletService, MintingService],
})
export class CardanoModule {}
