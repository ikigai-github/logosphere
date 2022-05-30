import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { 
  FlureeClient, 
  flureeConfig 
} from '@logosphere/fluree';
import {
  CardanoWalletService,
  MintService,
  cardanoWalletConfig,
  mintConfig,
} from '@logosphere/cardano';
import {} from './repositories/fluree';
import {} from './resolvers';
import {} from './mappers/fluree';
import {} from './mappers/dto';

@Module({
  imports: [
    ConfigModule.forFeature(flureeConfig),
    ConfigModule.forFeature(mintConfig),
    ConfigModule.forFeature(cardanoWalletConfig),
  ],
  providers: [
    FlureeClient,
    CardanoWalletService,
    MintService
  ],
  exports: []
})
export class <%= classify(name) %>Module {}
