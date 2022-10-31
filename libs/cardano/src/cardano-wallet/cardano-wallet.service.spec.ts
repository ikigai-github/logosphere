import { Test, TestingModule } from '@nestjs/testing';
import { CardanoWalletService } from './cardano-wallet.service';
import { cardanoWalletConfig } from './cardano-wallet.config';
import { ConfigModule } from '@nestjs/config';

import {
  WalletServer,
  Seed,
  AssetWallet,
  TokenWallet,
  Config,
  AddressWallet,
  NativeScript,
  ScriptAny,
  ShelleyWallet,
  ApiNetworkParameters,
  ApiNetworkInformation,
  TransactionWallet,
} from 'cardano-wallet-js';
describe('CardanoWalletService', () => {
  let service: CardanoWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(cardanoWalletConfig)],
      providers: [CardanoWalletService],
    }).compile();

    service = module.get<CardanoWalletService>(CardanoWalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create key pair from mnemonic phrase', () => {
    const privateKey = Seed.deriveRootKey([
      'short',
      'become',
      'slice',
      'cycle',
      'page',
      'ladder',
      'shoulder',
      'oppose',
      'cherry',
      'kidney',
      'decade',
      'primary',
      'electric',
      'impulse',
      'swing',
    ]);
    console.log(
      `Private Key: ${Buffer.from(privateKey.as_bytes()).toString('hex')}`
    );
    console.log(
      `Public key: ${Buffer.from(privateKey.to_public().as_bytes()).toString(
        'hex'
      )}`
    );
  });
});
