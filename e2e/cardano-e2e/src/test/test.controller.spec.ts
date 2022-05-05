import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CardanoWalletService,
  CardanoWalletError,
  cardanoWalletConfig,
  MintService,
  mintConfig,
  Nft,
} from '@logosphere/cardano';

let wallet: CardanoWalletService;
let minting: MintService;

let walletId: string;
let mintingWalletId: string;

jest.mock('@logosphere/cardano', () => ({
  cardanoWalletConfig: registerAs('cardanoWallet', () => ({
    url: 'http://localhost:7070/v2',
  })),
  CardanoWalletService: jest.requireActual('@logosphere/cardano')
    .CardanoWalletService,
  mintConfig: registerAs('mint', () => ({
    network: 'testnet',
  })),
  MintService: jest.requireActual('@logosphere/cardano').MintService,
}));

describe('Cardano Module', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(cardanoWalletConfig),
        ConfigModule.forFeature(mintConfig),
      ],
      providers: [CardanoWalletService, MintService],
    }).compile();

    wallet = module.get<CardanoWalletService>(CardanoWalletService);
    minting = module.get<MintService>(MintService);

    mintingWalletId = process.env.CARDANO_WALLET_ID;

    const walletName = 'notMyKeysNotMyCryptoWallet';
    const passPhrase = 'nothingdawg';
    const result = await wallet.createWallet(walletName, passPhrase);

    expect(result.id).toBeDefined();
    expect(result.id).toHaveLength(40);
    walletId = result.id;
    expect(result.mnemonic).toBeDefined();
    // TODO: this can be changed to use the constant, once bug https://github.com/nrwl/nx/issues/9319 is resolved
    // expect(result.mnemonic.split(' ').length).toBe(constants.MNEMONIC_PHRASE_LENGTH);
    expect(result.mnemonic.split(' ').length).toBe(15);
  });

  afterAll(async () => {
    await wallet.deleteWallet(walletId);
    expect(async () => {
      await wallet.getWallet(walletId);
    }).rejects.toThrowError(CardanoWalletError);
  });

  it('should get network information', async () => {
    const result = await wallet.getNetworkInformation();
    expect(result.sync_progress.status).toBe('ready');
  });

  it('should get network parameters', async () => {
    const result = await wallet.getNetworkParameters();
    expect(result.genesis_block_hash).toBe(
      '96fceff972c2c06bd3bb5243c39215333be6d56aaf4823073dca31afe5038471'
    );
  });

  it('should get created wallet', async () => {
    const result = await wallet.getWallet(walletId);
    expect(result.id).toBe(walletId);
  });

  it('should rename created wallet', async () => {
    const newName = 'anotherNameOfTheSameThing';
    const renamedWallet = await wallet.renameWallet(walletId, newName);
    expect(renamedWallet.name).toBe(newName);
  });

  it('should retrieve wallet balance', async () => {
    const balance = await wallet.getAccountBalance(walletId);
    expect(balance).toBe(0);
  });

  it('should retrieve wallet addresses', async () => {
    const addresses = await wallet.getWalletAddresses(walletId);
    expect(addresses.length > 0).toBeTruthy();
    expect(addresses[0].id.indexOf('addr') > -1).toBeTruthy();
    expect(addresses[0].state).toBe('unused');
  });

  it('should have ADA in the minting wallet', async () => {
    const balance = await wallet.getAccountBalance(mintingWalletId);
    console.log(`Available ADA in minting wallet: ${balance / 1000000}`);
    expect(balance).toBeGreaterThan(1000000);
  });

  it('should mint NFT', async () => {
    const ipfsCid = 'ipfs://QmPrhyaEVcavi3XuP7WHBcD2n8xcUK6mGcF1u6AchXYbgn';
    const name = 'Ikigai Logo';

    const nft: Nft = {
      name,
      description: 'Ikigai Technologies Logo',
      assetName: 'logosphere-minting-e2e-test',
      standard: '721',
      mediaType: 'image/*',
      version: '1.0',
      thumbnailIpfsCid: ipfsCid,
      files: [
        {
          name,
          mediaType: 'image/*',
          src: ipfsCid,
        },
      ],
      logosphere: {
        ledgerId: 'test/alpha',
        subjectId: '510173395288183',
        txId: '16e045cbf0fc416a291aba43365c77864756b452520e832e3388c66379bdcef3',
      },
    };

    const mintedNft = await minting.mint(
      process.env.CARDANO_WALLET_ID,
      process.env.CARDANO_WALLET_MNEMONIC,
      nft
    );

    console.log(`Minted NFT: ${JSON.stringify(mintedNft)}`);
  });

  // minting wallet:  2f144af47f06ffb2648470bd4452f25da09e9850 : "service measure clip canal toward door thought knock huge doctor library assume grid jealous lend"

  // other walet ids:
  // dc94f598eb6144cafcb3a6f1a20e7712e02156d9 : "forget sense waste pull spoil until best theme vital hotel eight confirm repeat sadness pink"
  // c78fe0bfc6a1198ea5f8de49e11a41701f5be72e : "track repeat toward type behave pull leg tribe leg soda forest master pitch benefit tenant"
  // 5f37c23c3cdc5b933919b09541ecee4183c06ad2 : "bamboo sail truth eyebrow ten sight main dilemma scheme jazz matrix dinosaur trim diary summer"
  // 7489ae286435120629b45beb5b7e8aa518a71e80 : "slice during dilemma grain inner orient error celery message slush liquid slogan clean wrong intact"
  // 78ed220a8d86b152b54d6b5c735360d5d19b1260 : "mnemonic":"rural excite bicycle arrest badge exact gesture pudding love lazy fall genre tortoise account donor"
});
