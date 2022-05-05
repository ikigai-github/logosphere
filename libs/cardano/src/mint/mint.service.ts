import {
  AssetWallet,
  Config,
  NativeScript,
  Seed,
  ScriptAny,
  TokenWallet,
} from 'cardano-wallet-js';
import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { mintConfig, MintConfig } from './mint.config';
import { MintError, mintMessages } from './mint.errors';
import { Nft } from './nft.dto';
import { CardanoWalletService } from '../cardano-wallet';

import * as config from './config.testnet.json';

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

  async mint(walletId: string, mnemonic: string, nft: Nft): Promise<Nft> {
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
      const scripts = tokens.map(
        (t) => t.script || NativeScript.new_script_any(new ScriptAny())
      );

      // get min ada for address holding tokens
      const minAda = Seed.getMinUtxoValueWithAssets([asset], config);
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

      // add signing keys
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
      const metadata = Seed.buildTransactionMetadata(data);

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

      // construct tx
      const txBody = Seed.buildTransactionWithToken(
        coinSelection,
        ttl,
        tokens,
        signingKeys,
        { data: data, config: config }
      );

      // sign the tx
      const tx = Seed.sign(txBody, signingKeys, metadata, scripts);

      // submit the tx
      const signed = Buffer.from(tx.to_bytes()).toString('hex');

      const txId = await this.#walletService.submitTx(signed);

      nft.txId = txId;
      return nft;
    } catch (error) {
      throw new MintError(mintMessages.MINT_FAILED, error);
    }
  }
}
