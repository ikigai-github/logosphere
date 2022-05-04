import { Test, TestingModule } from '@nestjs/testing';
import { CardanoWalletService } from './cardano-wallet.service';
import { cardanoWalletConfig } from './cardano-wallet.config';
import { ConfigModule } from '@nestjs/config';
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
});
