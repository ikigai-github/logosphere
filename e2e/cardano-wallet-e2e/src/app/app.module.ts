import { Module } from '@nestjs/common';
import { CardanoWalletModule } from '@logosphere/cardano';
import { TestController } from '../test/test.controller';

@Module({
  imports: [CardanoWalletModule],
  controllers: [TestController],
})
export class AppModule {}
