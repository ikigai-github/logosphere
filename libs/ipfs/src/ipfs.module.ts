import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PinataService, pinataConfig } from './pinata';

@Module({
  imports: [ConfigModule.forFeature(pinataConfig)],
  providers: [PinataService],
  exports: [PinataService],
})
export class IpfsModule {}
