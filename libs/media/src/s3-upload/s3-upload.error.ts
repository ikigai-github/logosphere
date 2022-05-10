import { LogosphereError } from '@logosphere/errors';

export const messages = Object.freeze({
  GET_S3_UPLOAD_URL_FAILED: 'Failed getting S3 upload signed url',
});

export class S3UploadError extends LogosphereError {
  constructor(message: string, error?: any) {
    const details =
      error.data && error.data.message ? error.data.message : error.message;
    super(`${message}: ${details}`, error);
  }
}
