/* eslint-disable @typescript-eslint/no-explicit-any */
export const mintMessages = Object.freeze({
  MINT_FAILED: 'Failed to mint NFT',
  TX_BUILD_FAILED: 'Failed to build transaction',
  WALLET_NOT_FUNDED: 'Wallet is not funded',
});

export class MintError extends Error {
  constructor(message: string, error?: any) {
    console.log(`Error: ${JSON.stringify(error)}`);
    const details =
      error.data && error.data.message ? error.data.message : error.message;
    super(`${message}: ${details}`);
  }
}
