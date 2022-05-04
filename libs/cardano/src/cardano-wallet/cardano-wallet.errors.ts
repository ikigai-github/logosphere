import { LogosphereError } from '@logosphere/errors';

export const messages = Object.freeze({
  MISSING_WALLET_NAME:
    'The wallet name parameter is either undefined or empty string. Should be a valid alpha-numeric.',
  MISSING_PASS_PHRASE: 'The passphrase is either undefined or empty string.',
  MISSING_WALLET_ID: 'Wallet ID is either undefined or empty string',
  CREATE_WALLET_FAILED: 'Failed to create wallet',
  DELETE_WALLET_FAILED: 'Failed to delete wallet',
  GET_WALLET_FAILED: 'Failed to get wallet',
  RENAME_WALLET_FAILED: 'Failed to rename wallet',
  GET_BALANCE_FAILED: 'Failed to retrieve wallet balance',
  GET_ADDRESSES_FAILED: 'Failed to retrieve wallet addresses',
});

export class CardanoWalletError extends LogosphereError {
  constructor(message: string, error?: any) {
    console.log(`Error: ${JSON.stringify(error)}`);
    const details =
      error.data && error.data.message ? error.data.message : error.message;
    super(`${message}: ${details}`, error);
  }
}
