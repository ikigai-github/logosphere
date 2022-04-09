import { Test, TestingModule } from '@nestjs/testing';
import { CardanoService } from './cardano.service';

describe('CardanoService', () => {
  let service: CardanoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardanoService],
    }).compile();

    service = module.get<CardanoService>(CardanoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
