import { registerAs } from '@nestjs/config';

export interface MintConfig {
  network: string;
}

export const mintConfig = registerAs('mint', () => ({
  network: process.env.CARDANO_NETWORK || 'testnet',
}));
