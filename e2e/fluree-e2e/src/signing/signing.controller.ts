import { CACHE_MANAGER, Controller, Get, Inject, Post } from '@nestjs/common';
import {
  create,
  FlureeClient,
  FlureeSignableCommand,
  signableCommand,
} from '@logosphere/fluree';
import { Cache } from 'cache-manager';

@Controller('sign')
export class SingingController {
  constructor(
    private client: FlureeClient,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  @Get()
  public async getSampleSignable(
    auth: string,
    collection: string,
    name: string
  ): Promise<FlureeSignableCommand> {
    const tx = create(collection).data({ name }).build();
    const signable = signableCommand(this.client.getLedger(), tx, auth);

    this.cacheManager.set(signable.hash, signable.serialized);

    return signable;
  }

  @Post()
  public async submitSigned({ hash, signature }) {
    const serialized = await this.cacheManager.get(hash);

    const result = await this.client.command(serialized, signature);

    return result;
  }
}
