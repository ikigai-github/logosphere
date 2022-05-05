export interface NftFile {
  name: string;
  mediaType: string;
  src: string;
}

export interface NftLogosphere {
  ledgerId: string;
  subjectId: string;
  txId: string;
}

export interface Nft {
  name: string;
  description: string;
  files: NftFile[];
  logosphere?: NftLogosphere;
  assetName: string;
  standard: string;
  mediaType: string;
  version: string;
  thumbnailIpfsCid: string;
  txId?: string;
  policyId?: string;
}
