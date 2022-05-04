import { registerAs } from '@nestjs/config';

export interface NftStorageConfig {
  apiKey: string;
}

export const nftStorageConfig = registerAs('nftStorage', () => ({
  apiKey: process.env.NFT_STORAGE_API_KEY,
}));
