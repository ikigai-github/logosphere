import { registerAs } from '@nestjs/config';

export interface S3UploadConfig {
  bucket: string;
  region: string;
  urlExpirySeconds: number;
}

export const s3UploadConfig = registerAs('s3Upload', () => ({
  bucket: process.env.S3_UPLOAD_BUCKET,
  region: process.env.AWS_REGION || 'us-east-1',
  urlExpirySeconds: +process.env.S3_URL_EXPIRY_SECONDS || 300,
}));
