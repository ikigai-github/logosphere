import { Controller, Get } from '@nestjs/common';
import {
  CardanoWalletService,
  ApiNetworkParameters,
} from '@logosphere/cardano';

@Controller('test')
export class TestController {
  constructor(private client: CardanoWalletService) {}

  @Get()
  public async getNetworkParameters(): Promise<ApiNetworkParameters> {
    return this.client.getNetworkParameters();
  }
}
