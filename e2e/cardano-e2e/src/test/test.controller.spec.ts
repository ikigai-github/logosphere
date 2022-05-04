import { ConfigModule, registerAs } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import {
  CardanoWalletService,
  CardanoWalletError,
  cardanoWalletConfig,
  // constants,
} from '@logosphere/cardano';

let wallet: CardanoWalletService;
let walletId: string;

jest.mock('@logosphere/cardano', () => ({
  cardanoWalletConfig: registerAs('cardanoWallet', () => ({
    url: 'http://localhost:7070/v2',
  })),
  CardanoWalletService: jest.requireActual('@logosphere/cardano')
    .CardanoWalletService,
}));

describe('Cardano Wallet Service', () => {
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forFeature(cardanoWalletConfig)],
      providers: [CardanoWalletService],
    }).compile();

    wallet = module.get<CardanoWalletService>(CardanoWalletService);

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

  //walet ids:
  // 2f144af47f06ffb2648470bd4452f25da09e9850 : "service measure clip canal toward door thought knock huge doctor library assume grid jealous lend"
  // dc94f598eb6144cafcb3a6f1a20e7712e02156d9 : "forget sense waste pull spoil until best theme vital hotel eight confirm repeat sadness pink"
  // c78fe0bfc6a1198ea5f8de49e11a41701f5be72e : "track repeat toward type behave pull leg tribe leg soda forest master pitch benefit tenant"
  // 5f37c23c3cdc5b933919b09541ecee4183c06ad2 : "bamboo sail truth eyebrow ten sight main dilemma scheme jazz matrix dinosaur trim diary summer"
  // 7489ae286435120629b45beb5b7e8aa518a71e80 : "slice during dilemma grain inner orient error celery message slush liquid slogan clean wrong intact"
  // 78ed220a8d86b152b54d6b5c735360d5d19b1260 : "mnemonic":"rural excite bicycle arrest badge exact gesture pudding love lazy fall genre tortoise account donor"
});
