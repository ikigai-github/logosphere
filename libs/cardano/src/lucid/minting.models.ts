export class MintingMetaData {
  name: string;
  description: string;
  image: string;
}

export class AssetData {
  name: string;
  amount: number;
}

export class NftDto {
  walletAddress: string;
  assetName: string;
  metaData: MintingMetaData
}

export class AssetDto {
  walletAddress: string;
  assets: AssetData[];
}

export class TransferRecipient {
  walletAddress: string;
  policyId?: string;
  asset: AssetData;
}

export class TransferDto {
  walletAddress: string;
  recipients: TransferRecipient[];
}