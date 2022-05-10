import { Controller, Get } from '@nestjs/common';
import { S3UploadService } from '@logosphere/media';

@Controller('test')
export class TestController {
  constructor(private client: S3UploadService) {}

  @Get()
  public async test(): Promise<boolean> {
    return true;
  }
}
