import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { CardanoWalletService, cardanoWalletConfig } from '@logosphere/cardano';

let wallet: CardanoWalletService;

jest.mock('@logosphere/cardano', () => ({
  cardanoWalletConfig: registerAs('cardanoWallet', () => ({
    url: 'http://localhost:7070/v2',
  })),
  CardanoWalletService: jest.requireActual('@logosphere/cardano')
    .CardanoWalletService,
}));

describe('Cardano Wallet Service', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(cardanoWalletConfig)],
      providers: [CardanoWalletService],
    }).compile();

    wallet = module.get<CardanoWalletService>(CardanoWalletService);
  });

  it('should get network information', async () => {
    const result = await wallet.getNetworkParameters();
    expect(result.genesis_block_hash).toBe(
      '96fceff972c2c06bd3bb5243c39215333be6d56aaf4823073dca31afe5038471'
    );
  });
});
