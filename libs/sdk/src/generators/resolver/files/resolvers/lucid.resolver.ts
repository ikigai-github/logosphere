import {
  Args,
  Context, 
  Mutation,
  Query,
  Resolver,
} from '@nestjs/graphql';
import {
  AssetDto,
  NftDto,
  SubmitService,
  TransactionService,
  TransferDto,
} from '@logosphere/cardano';

@Resolver('Lucid')
export class LucidResolver {

  private readonly SEED_PHRASE_HEADER = 'seed-phrase';

  constructor(
    private submitService: SubmitService,
    private transactionService: TransactionService
  ) { }

  @Mutation(() => String)
  async mintNft(
    @Args({ name: 'nft', type: () => NftDto }) nft: NftDto,
    @Context('req') req: Request
  ) {
    const seedPhrase = req.headers[this.SEED_PHRASE_HEADER]
    const cbor = await this.transactionService.getSignedNftMintingCbor(seedPhrase, nft)

    return await this.submitService.submit(cbor)
  }

  @Query(() => String)
  async mintingNftCbor(
    @Args({ name: 'nft', type: () => NftDto }) nft: NftDto,
  ): Promise<string> {
    return await this.transactionService.getNftMintingCbor(nft)
  }

  @Mutation(() => String)
  async mintAssets(
    @Args({ name: 'asset', type: () => AssetDto }) asset: AssetDto,
    @Context('req') req: Request
  ): Promise<string> {
    const seedPhrase = req.headers[this.SEED_PHRASE_HEADER]
    const cbor = await this.transactionService.getSignedAssesMintingCbor(seedPhrase, asset)

    return await this.submitService.submit(cbor)
  }

  @Query(() => String)
  async mintingAssetsCbor(
    @Args({ name: 'asset', type: () => AssetDto }) asset: AssetDto,
  ): Promise<string> {
    return await this.transactionService.getAssetsMintingCbor(asset)
  }

  @Mutation(() => String)
  async transfer(
    @Args({ name: 'transfer', type: () => TransferDto }) transfer: TransferDto,
    @Context('req') req: Request
  ): Promise<string> {
    const seedPhrase = req.headers[this.SEED_PHRASE_HEADER]
    const cbor = await this.transactionService.getSignedTransferCbor(seedPhrase, transfer);

    return await this.submitService.submit(cbor)
  }

  @Query(() => String)
  async transferCbor(
    @Args({ name: 'transfer', type: () => TransferDto }) transfer: TransferDto,
  ): Promise<string> {
    return await this.transactionService.getTransferCbor(transfer)
  }

  @Mutation(() => String)
  async submitTransaction(
    @Args({ name: 'cbor', type: () => String }) cbor: string,
  ): Promise<string> {
    return await this.submitService.submit(cbor)
  }

}