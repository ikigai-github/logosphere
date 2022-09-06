export class KeysDto {
  privateKey?: string;
  publicKey?: string;
}

export class WalletDto extends KeysDto {
  name?: string;
  passphrase?: string;
  id?: string;
  mnemonic?: string;
  address?: string;
}

