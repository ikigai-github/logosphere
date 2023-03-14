import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CardanoWalletService, cardanoWalletConfig } from './cardano-wallet';
import { SubmitService, TransactionService } from './lucid';
import { MintService } from './mint/mint.service';

@Module({
  imports: [ConfigModule.forFeature(cardanoWalletConfig)],
  providers: [CardanoWalletService, MintService, TransactionService, SubmitService],
  exports: [CardanoWalletService, TransactionService, SubmitService],
})
export class CardanoModule {}
