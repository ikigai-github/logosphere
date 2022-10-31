import axios, { AxiosError } from 'axios';
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
  min_ada_required,
} from 'cardano-wallet-js';

import {
  cardanoWalletConfig,
  CardanoWalletConfig,
} from './cardano-wallet.config';
import { CardanoWalletError, walletMessages } from './cardano-wallet.errors';
import { constants } from './cardano-wallet.constants';

import { String } from 'typescript-string-operations';

export interface CardanoWallet {
  id: string;
  name: string;
  mnemonic?: string;
  privateKey?: string;
  publicKey?: string;
  address: string;
}

export interface CardanoKeys {
  privateKey: string;
  publicKey: string;
  accountPublicKey: string;
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
      const privateKey = Seed.deriveRootKey(mnemonicSentence);
      const publicKey = privateKey.to_public();

      const privateKeyHex = Buffer.from(privateKey.as_bytes()).toString('hex');
      const publicKeyHex = Buffer.from(publicKey.as_bytes()).toString('hex');

      const wallet = await this.#walletServer.createOrRestoreShelleyWallet(
        name,
        mnemonicSentence,
        passphrase
      );

      const response = await wallet.addressesApi.listAddresses(wallet.id);
      const address =
        response && response.data && response.data.length > 0
          ? response.data[0].id
          : '';

      return {
        id: wallet.id,
        name: wallet.name,
        mnemonic: recoveryPhrase,
        publicKey: publicKeyHex,
        privateKey: privateKeyHex,
        address,
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

  async getCardanoWallet(
    walletId: string,
    mnemonic: string
  ): Promise<CardanoWallet> {
    if (String.IsNullOrWhiteSpace(walletId)) {
      throw new CardanoWalletError(walletMessages.MISSING_WALLET_ID);
    }

    try {
      const wallet = await this.#walletServer.getShelleyWallet(walletId);
      const response = await wallet.addressesApi.listAddresses(wallet.id);
      const address =
        response && response.data && response.data.length > 0
          ? response.data[0].id
          : '';

      let cardanoWallet: CardanoWallet = {
        id: wallet.id,
        name: wallet.name,
        address,
      };
      if (mnemonic) {
        let mnemonicArr = [];
        if (mnemonic.indexOf(',') > -1) {
          mnemonicArr = mnemonic.split(',');
        } else if (mnemonic.indexOf(' ') > -1) {
          mnemonicArr = mnemonic.split(' ');
        }

        const privateKey = Seed.deriveRootKey(mnemonicArr);
        const publicKey = privateKey.to_public();

        const privateKeyHex = Buffer.from(privateKey.as_bytes()).toString(
          'hex'
        );
        const publicKeyHex = Buffer.from(publicKey.as_bytes()).toString('hex');

        cardanoWallet = {
          ...cardanoWallet,
          privateKey: privateKeyHex,
          publicKey: publicKeyHex,
          mnemonic,
        };
      }
      return cardanoWallet;
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

  async createWalletFromPubKey(
    name: string,
    cardanoPublicKey: string
  ): Promise<CardanoWallet> {
    try {
      const response = await axios.post(`${this.#config.url}/wallets`, {
        name,
        account_public_key: cardanoPublicKey,
      });

      console.log(`Response Status: ${response.status}`);
      if (response.status === 201) {
        const wallet = response.data;
        const shelleyWallet = await this.#walletServer.getShelleyWallet(
          wallet.id
        );
        const addressResponse = await shelleyWallet.addressesApi.listAddresses(
          wallet.id
        );
        const address =
          addressResponse &&
          addressResponse.data &&
          addressResponse.data.length > 0
            ? addressResponse.data[0].id
            : '';

        return {
          id: wallet.id,
          name: wallet.name,
          address,
        };
      }
    } catch (error) {
      const err = error.toJSON();
      if (err.status === 409) {
        console.log(`Wallet already exists`);
        // TODO: find ways of linking existing wallet
        // retrieve walletId of existing wallet by account_public_key
      } else {
        throw new CardanoWalletError(err.message, err);
      }
    }
  }

  async getShelleyWallet(walletId: string) {
    return await this.#walletServer.getShelleyWallet(walletId);
  }

  generateKeys(): CardanoKeys {
    const recoveryPhrase = Seed.generateRecoveryPhrase(
      constants.MNEMONIC_PHRASE_LENGTH
    );

    const mnemonicSentence = Seed.toMnemonicList(recoveryPhrase);
    const rootKey = Seed.deriveRootKey(mnemonicSentence);
    const rootPublicKey = rootKey.to_public();
    const accountPrivateKey = Seed.deriveAccountKey(rootKey, 0);
    const accountPublicKey = accountPrivateKey.to_public();

    const rootKeyHex = Buffer.from(rootKey.as_bytes()).toString('hex');
    const rootPublicKeyHex = Buffer.from(rootPublicKey.as_bytes()).toString(
      'hex'
    );
    const accountPublicKeyHex = Buffer.from(
      accountPublicKey.as_bytes()
    ).toString('hex');

    return {
      privateKey: rootKeyHex,
      publicKey: rootPublicKeyHex,
      accountPublicKey: accountPublicKeyHex,
      mnemonic: mnemonicSentence.join(','),
    };
  }
}
