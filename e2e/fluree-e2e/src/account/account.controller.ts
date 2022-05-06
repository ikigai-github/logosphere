import { FlureeClient } from '@logosphere/fluree';
import { Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { createAccount } from './account.schema';

@Controller('account')
export class AccountController {
  constructor(private client: FlureeClient) {}

  @Post()
  public async createAcount() {
    return await createAccount(this.client);
  }

  @Get(':authId')
  public async getAccount(@Param('authId', ParseIntPipe) authId: number) {
    return await this.client.query({
      selectOne: ['*'],
      where: `_auth/id = ${authId}`,
    });
  }
}
