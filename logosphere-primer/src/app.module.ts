import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CatsModule } from './cats/cats.module';
import { UserModule } from './user/user.module';
import { MintingModule } from './minting/minting.module';
import { AuctionModule } from './auction/auction.module';

@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
    }),
    UserModule,
    MintingModule,
    AuctionModule,
  ],
  providers: [],
})
export class AppModule {}
