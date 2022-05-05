import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { pinataConfig } from './pinata.config';
import { PinataService } from './pinata.service';

describe('PinataService', () => {
  let service: PinataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(pinataConfig)],
      providers: [PinataService],
    }).compile();

    service = module.get<PinataService>(PinataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
