import { v4 as uuid4 } from 'uuid';
import { S3 } from 'aws-sdk';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { S3UploadConfig, s3UploadConfig } from './s3-upload.config';
import { S3UploadError, messages } from './s3-upload.error';

@Injectable()
export class S3UploadService {
  #config: S3UploadConfig;
  #s3: S3;

  /**
   * Constructs instance of the S3UploadService
   * @param config S3 upload config
   */
  constructor(
    @Inject(s3UploadConfig.KEY)
    config: ConfigType<typeof s3UploadConfig>
  ) {
    this.#config = config;
    this.#s3 = new S3({ region: this.#config.region });
  }

  /**
   * Gets upload URL to directly upload content to S3 bucket
   * @param contentType: content type header, i.e. image/jpeg
   * @param extension: extension of the uploaded file, i.e. jpg
   * @param folder: folder inside the bucket to put the content in, accepts subfolders i.e. f1/f2/f3 etc.
   * @returns { url, bucket, key } object
   */
  async getS3UploadUrl(
    contentType: string,
    extension: string,
    folder: string
  ): Promise<
    Readonly<{
      url: string;
      bucket: string;
      key: string;
    }>
  > {
    try {
      const uuid = uuid4();
      const key = `${folder}/${uuid}.${extension}`;
      const s3Params = {
        Bucket: this.#config.bucket,
        Key: key,
        Expires: +this.#config.urlExpirySeconds,
        ContentType: contentType,
      };

      const uploadUrl = await this.#s3.getSignedUrlPromise(
        'putObject',
        s3Params
      );
      const response = {
        url: uploadUrl,
        bucket: this.#config.bucket,
        key,
      };
      return response;
    } catch (error) {
      throw new S3UploadError(messages.GET_S3_UPLOAD_URL_FAILED, error);
    }
  }
}
