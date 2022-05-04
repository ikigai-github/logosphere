import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { NFTStorage } from 'nft.storage';
import * as fs from 'fs-extra';
import * as path from 'path';

import { NftStorageConfig, nftStorageConfig } from './nft-storage.config';
import { NftStorageError, messages } from './nft-storage.errors';

@Injectable()
export class NftStorageService {
  #config: NftStorageConfig;
  #nftStorage: NFTStorage;

  /**
   * Constructs instance of the NFT Storage service
   * @param config The NFT Storage client config
   */
  constructor(
    @Inject(nftStorageConfig.KEY)
    config: ConfigType<typeof nftStorageConfig>
  ) {
    this.#config = config;
    this.#nftStorage = new NFTStorage(
      Object.freeze({ token: this.#config.apiKey })
    );
  }

  /**
   * upload the artifact to IPFS
   *
   * @returns IPFS CID
   */
  async upload(filePath: string): Promise<Readonly<string>> {
    try {
      const file: Buffer = await fs.readFile(path.resolve(filePath));
      return await this.#nftStorage.storeBlob(new Blob([file]));
    } catch (error) {
      throw new NftStorageError(messages.IPFS_UPLOAD_FAILED, error);
    }
  }
}
