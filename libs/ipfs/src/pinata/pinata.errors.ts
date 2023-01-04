export const messages = Object.freeze({
  FILE_UPLOAD_FAILED: 'Failed to upload file to Pinata',
  AUTHENTICATION_FAILED: 'Pinata API authentication failed',
});

export class PinataError extends Error {
  constructor(message: string, error?: any) {
    const details =
      error.data && error.data.message ? error.data.message : error.message;
    super(`${message}: ${details}`);
  }
}
