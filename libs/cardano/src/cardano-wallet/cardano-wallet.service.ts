import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import {
  WalletServer,
  Seed,
  AssetWallet,
  TokenWallet,
  Config,
  AddressWallet,
  NativeScript,
  ScriptAny,
  ShelleyWallet,
  ApiNetworkParameters,
  ApiNetworkInformation,
  TransactionWallet,
} from 'cardano-wallet-js';
import {
  cardanoWalletConfig,
  CardanoWalletConfig,
} from './cardano-wallet.config';

import { String } from 'typescript-string-operations';
import { sha3_256 } from 'js-sha3';

@Injectable()
export class CardanoWalletService {
  #config: CardanoWalletConfig;
  #walletServer: WalletServer;

  /**
   * Constructs instance of the cardano wallet service
   * @param config The cardano wallet client config
   */
  constructor(
    @Inject(cardanoWalletConfig.KEY)
    config: ConfigType<typeof cardanoWalletConfig>
  ) {
    this.#config = config;
    this.#walletServer = WalletServer.init(config.url);
  }

  /**
   * Get network status
   *
   * @returns network status
   */
  async getNetworkInformation(): Promise<ApiNetworkInformation> {
    return await this.#walletServer.getNetworkInformation();
  }

  /**
   * Get network parameters
   *
   * @returns network parameters
   */
  async getNetworkParameters(): Promise<ApiNetworkParameters> {
    return await this.#walletServer.getNetworkParameters();
  }
}
