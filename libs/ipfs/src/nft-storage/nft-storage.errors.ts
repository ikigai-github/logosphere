import { LogosphereError } from '@logosphere/errors';

export const messages = Object.freeze({
  IPFS_UPLOAD_FAILED: 'Failed to upload file to IPFS',
});

export class NftStorageError extends LogosphereError {
  constructor(message: string, error?: any) {
    console.log(`Error: ${JSON.stringify(error)}`);
    const details =
      error.data && error.data.message ? error.data.message : error.message;
    super(`${message}: ${details}`, error);
  }
}
