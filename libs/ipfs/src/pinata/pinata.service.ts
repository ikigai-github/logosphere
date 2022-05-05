/* eslint-disable @typescript-eslint/no-var-requires */
import * as fs from 'fs-extra';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PinataClient, PinataPinOptions, PinataPinResponse } from '@pinata/sdk';

import { PinataConfig, pinataConfig } from './pinata.config';
import { PinataError, messages } from './pinata.errors';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pinataSDK = require('@pinata/sdk');
const _ = require('lodash');

@Injectable()
export class PinataService {
  #config: PinataConfig;
  #pinata: PinataClient;

  /**
   * Constructs instance of the Pinata service
   * @param config Pinata config
   */
  constructor(
    @Inject(pinataConfig.KEY)
    config: ConfigType<typeof pinataConfig>
  ) {
    this.#config = config;
    this.#pinata = pinataSDK(this.#config.apiKey, this.#config.apiSecret);
  }

  /**
   * Testing Pinata API authentication
   * @returns
   */
  async testAuthentication(): Promise<boolean> {
    return this.#pinata
      .testAuthentication()
      .catch((err) => {
        console.log(err);
      })
      .then((result) => {
        return result ? result.authenticated : false;
      });
  }

  /**
   *
   * @param file filePath or fs.ReadStream
   * @param metadata Optional metadata
   * @returns PinataPinOptions object
   */
  async uploadFile(
    file: string | fs.ReadStream,
    metadata?: PinataPinOptions
  ): Promise<PinataPinResponse> {
    const authenticated = await this.testAuthentication();
    if (!authenticated) {
      throw new PinataError(messages.AUTHENTICATION_FAILED);
    }

    if (_.isString(file)) {
      return this.#pinata
        .pinFromFS(file as string, metadata)
        .catch((err) => {
          throw new PinataError(messages.FILE_UPLOAD_FAILED, err);
        })
        .then((result: PinataPinResponse) => {
          return result;
        });
    } else {
      return this.#pinata
        .pinFileToIPFS(file as fs.ReadStream, metadata)
        .catch((err) => {
          throw new PinataError(messages.FILE_UPLOAD_FAILED, err);
        })
        .then((result: PinataPinResponse) => {
          return result;
        });
    }
  }
}
