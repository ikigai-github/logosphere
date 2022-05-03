import { registerAs } from '@nestjs/config';

export interface FlureeConfig {
  url: string;
  ledger: string;
}

export const flureeConfig = registerAs('fluree', () => ({
  url: process.env.FLUREE_URL || 'http://localhost:8090',
  ledger: process.env.FLUREE_LEDGER || 'test/testdb',
}));
