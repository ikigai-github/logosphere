import { Controller, Get } from '@nestjs/common';
import {
  CardanoWalletService,
  MintService,
  ApiNetworkParameters,
} from '@logosphere/cardano';

@Controller('test')
export class TestController {
  constructor(
    private wallet: CardanoWalletService,
    private minting: MintService
  ) {}

  @Get()
  public async getNetworkParameters(): Promise<ApiNetworkParameters> {
    return this.wallet.getNetworkParameters();
  }
}
