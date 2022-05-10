import { Module } from '@nestjs/common';
import { MediaModule } from '@logosphere/media';
import { TestController } from '../test/test.controller';

@Module({
  imports: [MediaModule],
  controllers: [TestController],
})
export class AppModule {}
