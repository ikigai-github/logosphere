
import { Module } from '@nestjs/common';
import { FlureeModule } from '@logosphere/fluree'
import { TestController } from '../test/test.controller';


@Module({
  imports: [FlureeModule],
  controllers: [TestController]
})
export class AppModule {}
