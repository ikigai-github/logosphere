/* eslint-disable @typescript-eslint/no-unused-vars */
import { Ent, Prop, registerEnum } from '@logosphere/sdk';

export enum Genre {
  Pop = 0,
  Rock,
  HipHop,
  RnB,
  Country,
  KPop,
  JPop,
  World,
}

registerEnum(Genre, 'Genre');

@Ent('artist')
export class Artist {
  @Prop({
    examples: ['Taylor Swift', 'Lil Nas X', 'Dua Lipa'],
  })
  name: string;

  @Prop({
    examples: ['About Taylor Swift', 'Lil Nas X Bio', 'Dua Lipa is awesome'],
  })
  about: string;
}

@Ent('album')
export class Album {
  @Prop({
    examples: ['Fearless', 'MONTERO', 'Future Nostalgia'],
  })
  name: string;

  @Prop({ type: () => Genre })
  genre: Genre;

  @Prop({ type: () => Artist, index: false })
  artist: Artist;
}

@Ent('track')
export class Track {
  @Prop({
    examples: ['Shake If Off', 'Montero', 'Levitating'],
  })
  name: string;

  @Prop({ type: () => Genre })
  genre: Genre;

  @Prop({
    examples: [
      'Be yourself and shake it off',
      'Also called call me by your name',
      'Just a great song',
    ],
  })
  description: string;

  @Prop({ type: () => Album, index: false })
  album: Album;

  @Prop({ type: () => Artist, index: false })
  artist: Artist;
}

@Ent('playlist')
export class Playlist {
  @Prop({
    examples: ['Top 40', 'Best of Pop', 'New releases'],
  })
  name: string;

  @Prop({ type: () => [Track], index: false })
  tracks: Track[];
}

@Ent('walletAsset')
class WalletAsset {
  @Prop({ doc: 'Name of the asset', examples: ['4269736f6e'] })
  name: string;

  @Prop({
    doc: 'Fingerprint of the asset',
    examples: ['asset12q7zh30hj2yme96wy8ms4fcdrwtep0auz8xqly'],
  })
  fingerprint: string;

  @Prop({
    doc: 'Policy ID of the asset',
    examples: ['0b7018936bc41808ddabd96b4908b583195a0c252b5752ad38012bdb'],
  })
  policyId: string;

  @Prop({ doc: 'Quantity of the asset', examples: ['1'] })
  quantity: number;

  @Prop({ doc: 'Metadata associated with the asset' })
  metadata: string;

  @Prop({ doc: 'Fluree subject ID of the asset', examples: ['87960930223082'] })
  assetSubjectId: string;

  @Prop({
    doc: 'Logosphere ID of the asset',
    examples: [
      '62c0ac76d6eebbf70828da57ea06c41a55001a2eb3cc929206d8f39abdbfaefc',
    ],
  })
  logosphereId: string;
}

@Ent('wallet')
class Wallet {
  @Prop({
    doc: 'Name of the wallet',
    examples: ['Babingos wallet'],
  })
  name: string;

  @Prop({
    doc: 'ID of the wallet',
    index: true,
    unique: true,
    examples: ['cd72843c95467883ccd6dafe227b91c96f071713'],
  })
  walletId: string;

  @Prop({
    doc: 'Address of the wallet',
    index: true,
    unique: true,
    examples: [
      'addr_test1qzsn8km55mp6cra7l20cymauks2fay8sqc3jr874mgmxpsa5mj4dvw5zrxmhauknj60c8tsf7x72ng0r8zmxa3necjlsgx9q6d',
    ],
  })
  address: string;

  @Prop({
    doc: 'Public key of the wallet',
    index: true,
    unique: true,
    examples: [
      'a1f009e6f5770c7b10729f27237c7ccc677739e31119a69766664dee611220948234926b2c445c2e9e2ff40f22beafa193d7fedf72e5e877bffd606d33b6638c',
    ],
  })
  publicKey: string;

  @Prop({
    doc: 'Balance of the wallet in lovelace',
    examples: ['0', '1000'],
  })
  balance: number;

  @Prop({
    doc: 'Wallet assets',
    type: () => [WalletAsset],
  })
  assets: WalletAsset[];
}

@Ent('user')
class User {
  @Prop({
    doc: 'Username of the user',
    index: true,
    unique: true,
    examples: ['babingo_whoelse'],
  })
  username: string;

  @Prop({
    doc: 'User wallet',
    type: () => Wallet,
  })
  wallet: Wallet;
}
