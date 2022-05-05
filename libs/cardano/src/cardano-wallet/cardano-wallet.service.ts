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
import { CardanoWalletError, walletMessages } from './cardano-wallet.errors';
import { constants } from './cardano-wallet.constants';

import { String } from 'typescript-string-operations';
import { sha3_256 } from 'js-sha3';

export interface CardanoWallet {
  id: string;
  name: string;
  mnemonic: string;
}

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

  /**
   * Create a new wallet
   *
   * @param {*} name of the wallet
   * @param {*} passphrase for the wallet
   * @returns new wallet and the generated mnemonic
   * @throws CardanoWalletError
   */
  async createWallet(name: string, passphrase: string): Promise<CardanoWallet> {
    if (String.IsNullOrWhiteSpace(name)) {
      throw new CardanoWalletError(walletMessages.MISSING_WALLET_NAME);
    }
    if (String.IsNullOrWhiteSpace(passphrase)) {
      throw new CardanoWalletError(walletMessages.MISSING_PASS_PHRASE);
    }

    try {
      const recoveryPhrase = Seed.generateRecoveryPhrase(
        constants.MNEMONIC_PHRASE_LENGTH
      );
      const mnemonicSentence = Seed.toMnemonicList(recoveryPhrase);
      const wallet = await this.#walletServer.createOrRestoreShelleyWallet(
        name,
        mnemonicSentence,
        passphrase
      );

      return {
        id: wallet.id,
        name: wallet.name,
        mnemonic: recoveryPhrase,
      };
    } catch (error) {
      console.log(error);
      throw new CardanoWalletError(
        walletMessages.CREATE_WALLET_FAILED,
        error.message
      );
    }
  }

  /**
   * Delete a user wallet
   *
   * @param {*} walletId
   * @returns void
   */
  async deleteWallet(walletId: string): Promise<void> {
    if (String.IsNullOrWhiteSpace(walletId)) {
      throw new CardanoWalletError(walletMessages.MISSING_WALLET_ID);
    }

    try {
      const wallet = await this.#walletServer.getShelleyWallet(walletId);
      await wallet.delete();
    } catch (error) {
      throw new CardanoWalletError(walletMessages.DELETE_WALLET_FAILED, error);
    }
  }

  /**
   * Get existing wallet by ID
   * @param walletId ID of the wallet
   * @returns wallet
   */
  async getWallet(walletId: string): Promise<ShelleyWallet> {
    if (String.IsNullOrWhiteSpace(walletId)) {
      throw new CardanoWalletError(walletMessages.MISSING_WALLET_ID);
    }

    try {
      return await this.#walletServer.getShelleyWallet(walletId);
    } catch (error) {
      throw new CardanoWalletError(walletMessages.GET_WALLET_FAILED, error);
    }
  }

  /**
   * Rename existing wallet to a new one
   * @param {*} walletId
   * @param {*} newName
   * @returns wallet object with new name
   */
  async renameWallet(
    walletId: string,
    newName: string
  ): Promise<ShelleyWallet> {
    if (String.IsNullOrWhiteSpace(walletId)) {
      throw new CardanoWalletError(walletMessages.MISSING_WALLET_ID);
    }
    if (String.IsNullOrWhiteSpace(newName)) {
      throw new CardanoWalletError(walletMessages.MISSING_WALLET_NAME);
    }

    try {
      const wallet = await this.#walletServer.getShelleyWallet(walletId);
      const renamedWallet = await wallet.rename(newName);
      return renamedWallet;
    } catch (error) {
      throw new CardanoWalletError(walletMessages.RENAME_WALLET_FAILED, error);
    }
  }

  /**
   * Returns the available balance in wallet
   *
   * Always Use this to validate if user is
   * having enough balance in their account
   * before any operation
   *
   * @param {*} walletId
   * @returns amount in lovelace
   */
  async getAccountBalance(walletId: string): Promise<number> {
    if (String.IsNullOrWhiteSpace(walletId)) {
      throw new CardanoWalletError(walletMessages.MISSING_WALLET_ID);
    }
    try {
      const wallet = await this.#walletServer.getShelleyWallet(walletId);
      return wallet.getAvailableBalance();
    } catch (error) {
      throw new CardanoWalletError(walletMessages.GET_BALANCE_FAILED, error);
    }
  }

  /**
   * Return account address in the wallet
   * @param {*} walletId
   * @returns Wallets list of addresses
   */
  async getWalletAddresses(walletId: string): Promise<AddressWallet[]> {
    if (String.IsNullOrWhiteSpace(walletId)) {
      throw new CardanoWalletError(walletMessages.MISSING_WALLET_ID);
    }

    try {
      const wallet = await this.#walletServer.getShelleyWallet(walletId);
      return await wallet.getAddresses();
    } catch (error) {
      throw new CardanoWalletError(walletMessages.GET_ADDRESSES_FAILED, error);
    }
  }

  /**
   * Submits transaction to blockchain
   * @param tx signed transaction
   * @returns transaction ID
   */
  async submitTx(tx: string): Promise<string> {
    return await this.#walletServer.submitTx(tx);
  }
}
