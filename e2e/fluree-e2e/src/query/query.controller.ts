import { Controller, Get, Param } from '@nestjs/common';
import { FlureeQueryResponse, FlureeClient } from '@logosphere/fluree';

@Controller('query')
export class QueryController {
  constructor(private client: FlureeClient) {}

  @Get('collection/:collection')
  public async findAll(
    @Param('collection') collection: string
  ): Promise<FlureeQueryResponse> {
    return this.client.query({ select: ['*'], from: collection });
  }
}
