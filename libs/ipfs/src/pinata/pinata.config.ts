import { registerAs } from '@nestjs/config';

export interface PinataConfig {
  apiKey: string;
  apiSecret: string;
  jwt: string;
}

export const pinataConfig = registerAs('pinata', () => ({
  apiKey: process.env.PINATA_API_KEY,
  apiSecret: process.env.PINATA_API_SECRET,
  jwt: process.env.PINATA_JWT,
}));
