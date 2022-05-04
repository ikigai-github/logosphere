import { registerAs } from '@nestjs/config';

export interface CardanoWalletConfig {
  url: string;
}

export const cardanoWalletConfig = registerAs('cardanoWallet', () => ({
  url: process.env.CARDANO_WALLET_URL || 'http://localhost:7070/v2',
}));
