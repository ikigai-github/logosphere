import { Module } from '@nestjs/common';
import { CardanoModule } from '@logosphere/cardano';
import { TestController } from '../test/test.controller';

@Module({
  imports: [CardanoModule],
  controllers: [TestController],
})
export class AppModule {}
