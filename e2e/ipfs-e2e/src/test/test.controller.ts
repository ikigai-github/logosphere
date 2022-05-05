import { Controller, Get } from '@nestjs/common';
import { PinataService } from '@logosphere/ipfs';

@Controller('test')
export class TestController {
  constructor(private client: PinataService) {}

  @Get()
  public async testAuthentication(): Promise<boolean> {
    return await this.client.testAuthentication();
  }
}
