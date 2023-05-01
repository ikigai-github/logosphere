export class MockLucid {
  newTxValue: any;
  completeValue: any;
  mintAssetsValue: any;
  collectFromValue: any;
  attachMetadataValue: any;
  selectWalletFromValue: any;
  attachMintingPolicyValue: any;
  selectWalletFromSeedValue: any;
  payToAddressValue: Map<string, any> = new Map();

  wallet = {
    address: jest.fn(async () => 'SomeMockWalletAddress'),
    getUtxos: jest.fn(async () => [
      { txHash: 'mockHash1', outputIndex: 1 },
      { txHash: 'mockHash2', outputIndex: 2 },
    ]),
  };

  utils = {
    getAddressDetails: jest.fn(() => ({
      paymentCredential: {
        hash: 'MockPaymentCredentials',
      },
    })),
    nativeScriptFromJson: jest.fn(() => 'MockNativePolicy'),
    mintingPolicyToId: jest.fn(() => 'MockPolicyId'),
    unixTimeToSlot: jest.fn(() => 100000),
  };

  sign = jest.fn(() => ({
    complete: jest.fn(async () => this),
  }));

  newTx = jest.fn((param?: any) => {
    this.newTxValue = param;
    return this;
  });

  mintAssets = jest.fn((param?: any) => {
    this.mintAssetsValue = param;
    return this;
  });

  collectFrom = jest.fn((param?: any) => {
    this.collectFromValue = param;
    return this;
  });

  attachMetadata = jest.fn((param?: any) => {
    this.attachMetadataValue = param;
    return this;
  });
  selectWalletFrom = jest.fn((param?: any) => {
    this.selectWalletFromValue = param;
    return this;
  });

  attachMintingPolicy = jest.fn((param?: any) => {
    this.attachMintingPolicyValue = param;
    return this;
  });

  selectWalletFromSeed = jest.fn((param?: any) => {
    this.selectWalletFromSeedValue = param;
    return this;
  });

  payToAddress = jest.fn((address: string, transaction: any) => {
    this.payToAddressValue.set(address, transaction);
    return this;
  });

  async complete(param?: any) {
    this.completeValue = param;
    return this;
  }
}

export class MockLc {
  constructor(private lucid: MockLucid) {}

  Lucid = {
    new: jest.fn(async () => this.lucid),
  };

  Data = {
    to: jest.fn()
  }

  Constr = jest.fn();
  Blockfrost = jest.fn();
  applyParamsToScript = jest.fn();

  fromText(text: string) {
    return `${text}_hash`;
  }
}
