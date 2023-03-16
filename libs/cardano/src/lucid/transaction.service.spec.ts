import { MockLucid, MockLc } from './lucid.test.models';
import { AssetDto, NftDto, TransferDto } from './minting.models';
import { TransactionService } from './transaction.service';

const nfrDto: NftDto = {
  walletAddress: 'MockWalletAddress',
  assetName: 'MockNft',
  metaData: {
    name: 'MockTokenName',
    description: 'MockDescription',
    image: 'MockIPFSImage',
  },
};

const assetDto: AssetDto = {
  walletAddress: 'MockWalletAddress',
  assets: [
    { name: 'AssetA', amount: 100 },
    { name: 'AssetB', amount: 200 },
  ],
};

const transferDto: TransferDto = {
  walletAddress: 'MockTransferAddress',
  recipients: [
    {
      walletAddress: 'RecipientAddressA',
      policyId: 'RecipientPolicyA',
      asset: {
        name: 'TransferTokenA',
        amount: 300,
      },
    },
    {
      walletAddress: 'RecipientAddressB',
      asset: {
        name: 'lovelace',
        amount: 400,
      },
    },
  ],
};

process.env.CARDANO_NETWORK = 'MockCardanoNetwork';
process.env.BLOCKFROST_URL = 'MockBlockfrostURL';

const mockLcData = {
  lc: undefined,
};

jest.mock('./lucid.cardano', () => ({
  LucidCardano: {
    getImport: jest.fn(async () => mockLcData.lc),
  },
}));

describe('TransactionService', () => {

  const transactionService = new TransactionService();

  it('should get signed NFT minting cbor', async () => {
    // GIVEN
    const mockLucid = new MockLucid();
    // WHEN
    mockLcData.lc = new MockLc(mockLucid);
    const result = await transactionService.getSignedNftMintingCbor('seed', nfrDto);
    // THEN
    expect(result).toBeDefined();
    expect(mockLucid.sign).toBeCalledTimes(1);
    expect(mockLucid.newTx).toBeCalledTimes(1);
    expect(mockLucid.mintAssets).toBeCalledTimes(1);
    expect(mockLucid.attachMetadata).toBeCalledTimes(1);
    expect(mockLucid.selectWalletFrom).toBeCalledTimes(0);
    expect(mockLucid.selectWalletFromSeed).toBeCalledTimes(1);
    expect(mockLucid.mintAssetsValue['MockPolicyIdMockNft_hash']).toBe(BigInt(1));
  });

  it('should get NFT minting cbor', async () => {
    // GIVEN
    const mockLucid = new MockLucid();
    // WHEN
    mockLcData.lc = new MockLc(mockLucid);
    const result = await transactionService.getNftMintingCbor(nfrDto);
    // THEN
    expect(result).toBeDefined();
    expect(mockLucid.sign).toBeCalledTimes(0);
    expect(mockLucid.newTx).toBeCalledTimes(1);
    expect(mockLucid.mintAssets).toBeCalledTimes(1);
    expect(mockLucid.attachMetadata).toBeCalledTimes(1);
    expect(mockLucid.selectWalletFrom).toBeCalledTimes(1);
    expect(mockLucid.selectWalletFromSeed).toBeCalledTimes(0);
    expect(mockLucid.mintAssetsValue['MockPolicyIdMockNft_hash']).toBe(BigInt(1));
  });

  it('should get signed assets minting cbor', async () => {
    // GIVEN
    const mockLucid = new MockLucid();
    // WHEN
    mockLcData.lc = new MockLc(mockLucid);
    const result = await transactionService.getSignedAssesMintingCbor('seed', assetDto);
    // THEN
    expect(result).toBeDefined();
    expect(mockLucid.sign).toBeCalledTimes(1);
    expect(mockLucid.newTx).toBeCalledTimes(1);
    expect(mockLucid.mintAssets).toBeCalledTimes(1);
    expect(mockLucid.attachMetadata).toBeCalledTimes(0);
    expect(mockLucid.selectWalletFrom).toBeCalledTimes(0);
    expect(mockLucid.selectWalletFromSeed).toBeCalledTimes(1);
    expect(mockLucid.mintAssetsValue['MockPolicyIdAssetA_hash']).toBe(BigInt(100));
    expect(mockLucid.mintAssetsValue['MockPolicyIdAssetB_hash']).toBe(BigInt(200));
  });

  it('should get assets minting cbor', async () => {
    // GIVEN
    const mockLucid = new MockLucid();
    // WHEN
    mockLcData.lc = new MockLc(mockLucid);
    const result = await transactionService.getAssetsMintingCbor(assetDto);
    // THEN
    expect(result).toBeDefined();
    expect(mockLucid.sign).toBeCalledTimes(0);
    expect(mockLucid.newTx).toBeCalledTimes(1);
    expect(mockLucid.mintAssets).toBeCalledTimes(1);
    expect(mockLucid.attachMetadata).toBeCalledTimes(0);
    expect(mockLucid.selectWalletFrom).toBeCalledTimes(1);
    expect(mockLucid.selectWalletFromSeed).toBeCalledTimes(0);
    expect(mockLucid.mintAssetsValue['MockPolicyIdAssetA_hash']).toBe(BigInt(100));
    expect(mockLucid.mintAssetsValue['MockPolicyIdAssetB_hash']).toBe(BigInt(200));
  });

  it('should get signed transfer cbor', async () => {
    // GIVEN
    const mockLucid = new MockLucid();
    // WHEN
    mockLcData.lc = new MockLc(mockLucid);
    const result = await transactionService.getSignedTransferCbor('seed', transferDto);
    // THEN
    expect(result).toBeDefined();
    expect(mockLucid.sign).toBeCalledTimes(1);
    expect(mockLucid.newTx).toBeCalledTimes(1);
    expect(mockLucid.mintAssets).toBeCalledTimes(0);
    expect(mockLucid.payToAddress).toBeCalledTimes(2);
    expect(mockLucid.attachMetadata).toBeCalledTimes(0);
    expect(mockLucid.selectWalletFrom).toBeCalledTimes(0);
    expect(mockLucid.selectWalletFromSeed).toBeCalledTimes(1);
    expect(mockLucid.payToAddressValue.size).toBe(2);
    expect(mockLucid.payToAddressValue.get('RecipientAddressA')['RecipientPolicyATransferTokenA_hash']).toBe(BigInt(300));
    expect(mockLucid.payToAddressValue.get('RecipientAddressB')['lovelace']).toBe(BigInt(400));
  });

  it('should get transfer cbor', async () => {
    // GIVEN
    const mockLucid = new MockLucid();
    // WHEN
    mockLcData.lc = new MockLc(mockLucid);
    const result = await transactionService.getTransferCbor(transferDto);
    // THEN
    expect(result).toBeDefined();
    expect(mockLucid.sign).toBeCalledTimes(0);
    expect(mockLucid.newTx).toBeCalledTimes(1);
    expect(mockLucid.mintAssets).toBeCalledTimes(0);
    expect(mockLucid.payToAddress).toBeCalledTimes(2);
    expect(mockLucid.attachMetadata).toBeCalledTimes(0);
    expect(mockLucid.selectWalletFrom).toBeCalledTimes(1);
    expect(mockLucid.selectWalletFromSeed).toBeCalledTimes(0);
    expect(mockLucid.payToAddressValue.size).toBe(2);
    expect(mockLucid.payToAddressValue.get('RecipientAddressA')['RecipientPolicyATransferTokenA_hash']).toBe(BigInt(300));
    expect(mockLucid.payToAddressValue.get('RecipientAddressB')['lovelace']).toBe(BigInt(400));
  });
});
