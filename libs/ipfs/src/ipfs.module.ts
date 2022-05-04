import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NftStorageService, nftStorageConfig } from './nft-storage';

@Module({
  imports: [ConfigModule.forFeature(nftStorageConfig)],
  providers: [NftStorageService],
  exports: [NftStorageService],
})
export class IpfsModule {}
