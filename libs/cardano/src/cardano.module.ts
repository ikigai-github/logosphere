import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CardanoWalletService, cardanoWalletConfig } from './cardano-wallet';

@Module({
  imports: [ConfigModule.forFeature(cardanoWalletConfig)],
  providers: [CardanoWalletService],
  exports: [CardanoWalletService],
})
export class CardanoModule {}
