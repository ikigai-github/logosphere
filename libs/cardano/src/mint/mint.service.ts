import {
  AssetWallet,
  AddressWallet,
  NativeScript,
  Seed,
  ScriptAny,
  PrivateKey,
  TokenWallet,
  ApiCoinSelection,
} from 'cardano-wallet-js';

import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { mintConfig, MintConfig } from './mint.config';
import { MintError, mintMessages } from './mint.errors';
import { Nft } from './nft.dto';
import { CardanoWalletService } from '../cardano-wallet';

import * as config from './config.testnet.json';
import * as trx from './tx.json';

export interface CardanoTx {
  coinSelection: ApiCoinSelection;
  ttl: number;
  tokens: TokenWallet[];
  signingKeys?: PrivateKey[];
  data: any;
}

@Injectable()
export class MintService {
  #config: MintConfig;
  #walletService: CardanoWalletService;

  #prepareTokenData(nft: Nft): any {
    return {
      [nft.policyId]: {
        [nft.assetName]: {
          name: nft.name,
          description: nft.description,
          image: nft.thumbnailIpfsCid,
          mediatype: nft.mediaType,
          files: nft.files,
          logosphere: nft.logosphere,
        },
      },
      version: nft.version,
    };
  }

  /**
   * Constructs instance of the mint service
   * @param config The mint service config
   */
  constructor(
    @Inject(mintConfig.KEY)
    config: ConfigType<typeof mintConfig>,
    walletService: CardanoWalletService
  ) {
    this.#config = config;
    this.#walletService = walletService;
  }

  #createSigningKeys(
    coinSelection: ApiCoinSelection,
    tokens: TokenWallet[],
    mnemonic: string
  ) {
    const rootKey = Seed.deriveRootKey(mnemonic.split(','));

    const signingKeys = coinSelection.inputs.map((i) => {
      const privateKey = Seed.deriveKey(
        rootKey,
        i.derivation_path
      ).to_raw_key();
      return privateKey;
    });

    // add policy signing keys
    tokens
      .filter((t) => t.scriptKeyPairs)
      .forEach((t) =>
        signingKeys.push(
          ...(t.scriptKeyPairs || []).map((k) => k.privateKey.to_raw_key())
        )
      );
    return signingKeys;
  }

  async buildTx(walletId: string, nft: Nft): Promise<CardanoTx> {
    try {
      const wallet = await this.#walletService.getWallet(walletId);
      const addresses = [(await wallet.getAddresses())[0]];

      // generate policy id
      const keyPair = Seed.generateKeyPair();
      const policyVKey = keyPair.publicKey;
      const keyHash = Seed.getKeyHash(policyVKey);
      const script = Seed.buildSingleIssuerScript(keyHash);
      const scriptHash = Seed.getScriptHash(script);
      const policyId = Seed.getPolicyId(scriptHash);
      nft.policyId = policyId;

      // prepare token as metadata standard
      const data = {};
      const preparedToken = this.#prepareTokenData(nft);
      data[0] = preparedToken;

      // configure
      const asset = new AssetWallet(policyId, nft.assetName, 1);
      const tokens = [new TokenWallet(asset, script, [keyPair])];

      // get min ada for address holding tokens
      const minAda =
        Seed.getMinUtxoValueWithAssets([asset], config) +
        Number(process.env.CARDANO_FEE_ADJUSTMENT || 100);
      const amounts = [minAda];

      // get ttl info
      const info = await this.#walletService.getNetworkInformation();
      const ttl = info.node_tip.absolute_slot_number * 12000;

      // get coin selection structure (without the assets)
      const coinSelection = await wallet.getCoinSelection(
        addresses,
        amounts,
        data
      );

      // the wallet currently doesn't support including tokens not previuosly minted
      // so we need to include it manually.
      coinSelection.outputs = coinSelection.outputs.map((output) => {
        if (output.address === addresses[0].address) {
          output.assets = tokens.map((t) => {
            const asset = {
              policy_id: t.asset.policy_id,
              asset_name: Buffer.from(t.asset.asset_name).toString('hex'),
              quantity: t.asset.quantity,
            };
            return asset;
          });
        }
        return output;
      });

      const tx = {
        coinSelection,
        ttl,
        tokens,
        data,
      };

      return tx;
    } catch (error) {
      throw new MintError(mintMessages.TX_BUILD_FAILED, error);
    }
  }

  async mint(walletId: string, mnemonic: string, nft: Nft): Promise<Nft> {
    try {
      const { coinSelection, ttl, tokens, data } = await this.buildTx(
        walletId,
        nft
      );

      const signingKeys = this.#createSigningKeys(
        coinSelection,
        tokens,
        mnemonic
      );

      // construct tx
      const txBody = Seed.buildTransactionWithToken(
        coinSelection,
        ttl,
        tokens,
        signingKeys,
        { data: data, config: config }
      );

      const scripts = tokens.map(
        (t) => t.script || NativeScript.new_script_any(new ScriptAny())
      );

      const metadata = Seed.buildTransactionMetadata(data);

      // sign the tx
      const tx = Seed.sign(txBody, signingKeys, metadata, scripts);

      // submit the tx
      const signed = Buffer.from(tx.to_bytes()).toString('hex');

      const txId = await this.#walletService.submitTx(signed);

      // const txId = await this.#walletService.submitTx(trx.cborHex);

      console.log(`Submitted Tx ID: ${txId}`);

      nft.txId = txId;
      return nft;
    } catch (error) {
      throw new MintError(mintMessages.MINT_FAILED, error);
    }
  }

  async transferAsset(
    policyId: string,
    address: string,
    walletId: string
  ): Promise<string> {
    try {
      const addresses = [new AddressWallet(address)];

      const assetName: string = process.env.ASSET_NAME || '';

      const asset = new AssetWallet(policyId, assetName, 1);

      const assets: { [key: string]: [AssetWallet] } = {};
      assets[addresses[0].id] = [asset];

      const minUtxo =
        Seed.getMinUtxoValueWithAssets([asset], config) +
        Number(process.env.CARDANO_FEE_ADJUSTMENT || 100);

      const wallet = await this.#walletService.getShelleyWallet(walletId);

      const data = ['send tokens'];
      const coinSelection = await wallet.getCoinSelection(
        addresses,
        [minUtxo],
        data,
        assets
      );
      const info = await this.#walletService.getNetworkInformation();

      const mnemonic: string = process.env.CARDANO_WALLET_MNEMONIC;

      const rootKey = Seed.deriveRootKey(mnemonic.split(','));
      const signingKeys = coinSelection.inputs.map((i) => {
        const privateKey = Seed.deriveKey(
          rootKey,
          i.derivation_path
        ).to_raw_key();
        return privateKey;
      });

      const metadata = Seed.buildTransactionMetadata(data);
      const txBuild = Seed.buildTransaction(
        coinSelection,
        info.node_tip.absolute_slot_number * 12000,
        { metadata: metadata, config: config }
      );
      const txBody = Seed.sign(txBuild, signingKeys, metadata);
      const signed = Buffer.from(txBody.to_bytes()).toString('hex');
      const txId = await this.#walletService.submitTx(signed);
      console.log(
        `Asset successfully transfered to : [${address}]. Transaction id : [${txId}]`
      );
      return txId;
    } catch (error) {
      throw new MintError(
        `Failed to transfer assets to address ${address}`,
        error.message
      );
    }
  }
}
