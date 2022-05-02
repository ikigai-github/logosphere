import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { FlureeClient } from './fluree.client';
import { flureeConfig } from './fluree.config';

@Module({
  imports: [ConfigModule.forFeature(flureeConfig)],
  providers: [FlureeClient],
  exports: [FlureeClient]
})
export class FlureeModule {}
