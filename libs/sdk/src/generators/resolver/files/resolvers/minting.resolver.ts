import {
  Args,
  Context, Mutation,
  Query,
  Resolver
} from '@nestjs/graphql';
import { MintingDto, MintingService } from '@logosphere/cardano';

@Resolver('Minting')
export class MintingResolver {

  private readonly SEED_PHRASE_HEADER = 'seed-phrase';

  constructor(
    private mintingService: MintingService
  ) { }

  @Query(() => String)
  async getCbor(
    @Args({ name: 'nft', type: () => MintingDto }) nft: MintingDto,
    @Context('req') req: Request
  ): Promise<string> {
    const seedPhrase = req.headers[this.SEED_PHRASE_HEADER]
    return await this.mintingService.getCbor(seedPhrase, nft);
  }

  @Mutation(() => String)
  async submitTransaction(
    @Args({ name: 'cbor', type: () => String }) cbor: string
  ): Promise<string> {
    return await this.mintingService.sendTransaction(cbor)
  }

  @Mutation(() => String)
  async mintNft(
    @Args({ name: 'nft', type: () => MintingDto }) nft: MintingDto,
    @Context('req') req: Request
  ): Promise<string> {
    const seedPhrase = req.headers[this.SEED_PHRASE_HEADER]
    const cbor = await this.mintingService.getCbor(seedPhrase, nft);
    return await this.mintingService.sendTransaction(cbor)
  }

}