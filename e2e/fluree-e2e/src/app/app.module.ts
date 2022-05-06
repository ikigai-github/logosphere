import { Module, CacheModule } from '@nestjs/common';
import { FlureeModule } from '@logosphere/fluree';
import { QueryController } from '../query/query.controller';
import { SingingController } from '../signing/signing.controller';

@Module({
  imports: [FlureeModule, CacheModule.register()],
  controllers: [QueryController, SingingController],
})
export class AppModule {}
