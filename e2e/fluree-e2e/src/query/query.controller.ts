import { Controller, Get } from '@nestjs/common';
import { FlureeQueryResponse, FlureeClient } from '@logosphere/fluree';

@Controller('query')
export class QueryController {
  constructor(private client: FlureeClient) {}

  @Get()
  public async get(): Promise<FlureeQueryResponse> {
    return this.client.query({ select: ['*'], from: '_collection' });
  }
}
