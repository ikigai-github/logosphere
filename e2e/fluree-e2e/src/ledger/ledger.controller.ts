import { FlureeClient } from '@logosphere/fluree';
import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';

@Controller('ledger')
export class LedgerController {
  constructor(private client: FlureeClient) {}

  @Post()
  public createLedger(@Body('ledger') ledger: string) {
    return this.client.createLedger(ledger);
  }

  @Get(':ledger')
  public getLedgerInfo(@Param('ledger') ledger: string) {
    return this.client.ledgerInfo(ledger);
  }

  @Delete(':ledger')
  public deleteLedger(@Param('ledger') ledger: string) {
    return this.client.deleteLedger(ledger);
  }
}
