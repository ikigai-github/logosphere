import { Module, CacheModule } from '@nestjs/common';
import { FlureeModule } from '@logosphere/fluree';
import { QueryController } from '../query';
import { SingingController } from '../signing';
import { LedgerController } from '../ledger';
import { AccountController } from '../account';
import { CollectionController } from '../collection';

@Module({
  imports: [FlureeModule, CacheModule.register()],
  controllers: [
    LedgerController,
    QueryController,
    SingingController,
    AccountController,
    CollectionController,
  ],
})
export class AppModule {}
