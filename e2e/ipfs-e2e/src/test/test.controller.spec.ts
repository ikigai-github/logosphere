import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  NftStorageService,
  nftStorageConfig,

  // constants,
} from '@logosphere/ipfs';

let nftStorage: NftStorageService;

jest.mock('@logosphere/ipfs', () => ({
  nftStorageConfig: registerAs('nftStorage', () => ({
    apiKey: process.env.NFT_STORAGE_API_KEY,
  })),
  NftStorageService: jest.requireActual('@logosphere/ipfs').NftStorageService,
}));

describe('Nft Storage Service', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(nftStorageConfig)],
      providers: [NftStorageService],
    }).compile();

    nftStorage = module.get<NftStorageService>(NftStorageService);
    expect(nftStorage).toBeDefined();
  });

  it('should upload file to IPFS', () => {
    const cid = nftStorage.upload('./ikigai_logo.png');
    console.log(cid);
  });
});
