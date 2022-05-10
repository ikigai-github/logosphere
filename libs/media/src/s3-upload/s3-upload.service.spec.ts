import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { s3UploadConfig } from './s3-upload.config';
import { S3UploadService } from './s3-upload.service';

describe('S3UploadService', () => {
  let service: S3UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(s3UploadConfig)],
      providers: [S3UploadService],
    }).compile();

    service = module.get<S3UploadService>(S3UploadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
