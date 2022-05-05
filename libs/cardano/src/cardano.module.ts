import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CardanoWalletService, cardanoWalletConfig } from './cardano-wallet';
import { MintService } from './mint/mint.service';

@Module({
  imports: [ConfigModule.forFeature(cardanoWalletConfig)],
  providers: [CardanoWalletService, MintService],
  exports: [CardanoWalletService],
})
export class CardanoModule {}
