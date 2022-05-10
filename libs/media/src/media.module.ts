import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { S3UploadService, s3UploadConfig } from './s3-upload';

@Module({
  imports: [ConfigModule.forFeature(s3UploadConfig)],
  providers: [S3UploadService],
  exports: [S3UploadService],
})
export class MediaModule {}
