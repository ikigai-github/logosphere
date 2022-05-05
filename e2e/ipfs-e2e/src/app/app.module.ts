import { Module } from '@nestjs/common';
import { IpfsModule } from '@logosphere/ipfs';
import { TestController } from '../test/test.controller';

@Module({
  imports: [IpfsModule],
  controllers: [TestController],
})
export class AppModule {}
