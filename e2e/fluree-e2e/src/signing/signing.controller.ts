import {
  Body,
  CACHE_MANAGER,
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  create,
  FlureeClient,
  FlureeSignableCommand,
  signableCommand,
} from '@logosphere/fluree';
import { Cache } from 'cache-manager';

import { CreateSampleRequest, SubmitSampleRequest } from './singing.schema';

@Controller('sign')
export class SingingController {
  constructor(
    private client: FlureeClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Post('sample')
  public async createSampleSignable(
    @Body() { collection, name, auth }: CreateSampleRequest
  ): Promise<FlureeSignableCommand> {
    const tx = create(collection).data({ name }).build();
    const signable = signableCommand(this.client.getLedger(), tx, auth);

    this.cacheManager.set(signable.hash, signable.serialized);

    return signable;
  }

  @Post('submit')
  public async submitSigned(@Body() { hash, signature }: SubmitSampleRequest) {
    const serialized = await this.cacheManager.get(hash);
    const result = await this.client.command(serialized, signature);

    return result;
  }

  @Get(':txId')
  public async waitTransaction(
    @Param('txId') txId: string,
    @Query('maxWaitMs', new DefaultValuePipe(1000), ParseIntPipe)
    maxWaitMs: number
  ) {
    return await this.client.waitTransaction(txId, maxWaitMs);
  }
}
