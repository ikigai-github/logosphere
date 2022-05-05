import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { CardanoWalletService, cardanoWalletConfig } from '../cardano-wallet';
import { mintConfig } from './mint.config';
import { MintService } from './mint.service';

describe('MintService', () => {
  let mintService: MintService;
  let walletService: CardanoWalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(cardanoWalletConfig),
        ConfigModule.forFeature(mintConfig),
      ],
      providers: [CardanoWalletService, MintService],
    }).compile();

    mintService = module.get<MintService>(MintService);
    walletService = module.get<CardanoWalletService>(CardanoWalletService);
  });

  it('should be defined', () => {
    expect(mintService).toBeDefined();
    expect(walletService).toBeDefined();
  });
});
