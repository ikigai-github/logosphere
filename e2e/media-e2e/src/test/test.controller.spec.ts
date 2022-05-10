import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import * as fs from 'fs-extra';
import { S3 } from 'aws-sdk';

import { S3UploadService, s3UploadConfig } from '@logosphere/media';

let s3Upload: S3UploadService;
let s3: S3;

const filePath = `${__dirname}/ikigai_logo.png`;

jest.mock('@logosphere/media', () => ({
  s3UploadConfig: registerAs('s3Upload', () => ({
    bucket: process.env.S3_UPLOAD_BUCKET,
    region: process.env.AWS_REGION,
    urlExpirySeconds: process.env.S3_URL_EXPIRY_SECONDS,
  })),
  S3UploadService: jest.requireActual('@logosphere/media').S3UploadService,
}));

describe('Media Module', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(s3UploadConfig)],
      providers: [S3UploadService],
    }).compile();

    s3Upload = module.get<S3UploadService>(S3UploadService);

    expect(s3Upload).toBeDefined();

    s3 = new S3({ region: process.env.AWS_REGION });

    expect(s3).toBeDefined();
  });

  it('should get signed S3 upload URL, upload and download the same file', async () => {
    // get signed S3 url
    const response = await s3Upload.getS3UploadUrl(
      'image/png',
      'png',
      'media-e2e-test'
    );
    expect(response.url).toBeDefined();
    expect(response.url).toMatch(
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/
    );
    expect(response.bucket).toBe(process.env.S3_UPLOAD_BUCKET);

    // upload file
    const file: Buffer = fs.readFileSync(filePath);
    const uploaded = await s3
      .putObject({
        Body: file,
        Bucket: response.bucket,
        Key: response.key,
      })
      .promise();
    expect(uploaded.ETag).toBeDefined();

    // download file

    const downloaded = await s3
      .getObject({
        Bucket: response.bucket,
        Key: response.key,
      })
      .promise();

    expect(downloaded.Body).toStrictEqual(file);
  });
});
