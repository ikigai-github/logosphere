import { Controller, Get } from '@nestjs/common';
import { NftStorageService } from '@logosphere/ipfs';

@Controller('test')
export class TestController {
  constructor(private client: NftStorageService) {}

  @Get()
  public async getNetworkParameters(): Promise<void> {
    //return this.client.getNetworkParameters();
  }
}
