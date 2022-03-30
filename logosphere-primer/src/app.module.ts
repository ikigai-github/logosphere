import { ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { CatsModule } from './cats/cats.module';
import { UserModule } from './user/user.module';
import { MintingModule } from './minting/minting.module';
import { AuctionModule } from './auction/auction.module';

@Module({
  imports: [
    //TODO: Cats module only needed for testing the endpoint and should be deleted once the primer modules (User, Minting and Auction) are fully operational
    CatsModule, 
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      installSubscriptionHandlers: true,
      driver: ApolloDriver
      
    }),
    UserModule,
    MintingModule,
    AuctionModule,
  ],
  providers: [],
})
export class AppModule {}
