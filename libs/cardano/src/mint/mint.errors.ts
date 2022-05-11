import { LogosphereError } from '@logosphere/errors';

export const mintMessages = Object.freeze({
  MINT_FAILED: 'Failed to mint NFT',
});

export class MintError extends LogosphereError {
  constructor(message: string, error?: any) {
    console.log(`Error: ${JSON.stringify(error)}`);
    const details =
      error.data && error.data.message ? error.data.message : error.message;
    super(`${message}: ${details}`, error);
  }
}