import { Test, TestingModule } from '@nestjs/testing';
import { ArtworkResolver } from './artwork.resolver';

describe('ArtworkResolver', () => {
  let resolver: ArtworkResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArtworkResolver],
    }).compile();

    resolver = module.get<ArtworkResolver>(ArtworkResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
