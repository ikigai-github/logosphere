import { Injectable, Logger } from '@nestjs/common';
// Can be used only as Types. Each callable should be used by inline import
// Otherwise application run will fail by ES module export Errors
import {
  Assets,
  Json,
  Lucid,
  MintingPolicy,
  Network,
  TxComplete,
  UTxO,
} from 'lucid-cardano';
import {
  AssetData,
  AssetDto,
  MintingMetaData,
  NftDto,
  TransferDto,
  TransferRecipient,
} from './minting.models';
import { LucidCardano } from './lucid.cardano';

enum ConstructorType { seed, address }
type LucidTuple = { lc: any; lucid: Lucid };
type WalletConstructor = { type: ConstructorType; value: string };

const BULK_MINTING_SCRIPT = `
  5902265902230100003232323232323232323232323232323222232323232325
  3330133370e90000010991919191919299980c991919299980e19b8748000008
  54cc048cdc38031bad301e301f00e15330123370e00a9000099199180e112999
  80f8008a50153323302100114a26006604400226004604600246466ebcdd3981
  18019ba7302300130203022001005301e00e15330123370e00c90000a9980919
  b88005480004cc8c06c894ccc0780045288a9980a98019810800898011811000
  919299980f19b8848000cc05802cdd59810181098110008991919299981099b8
  7480080085280a513025002302000137546460426046002604060440022944c0
  7cc080c084004010c080008c06c004dd50068a4c2c6eb0c068010ccc0408cdc4
  000a40000080046601c0060026eacc05cc8c064c064c064004c060004c060c05
  8014dd7180a8008b180b80118090009baa301230130013013002301200322333
  00c00200100314a06002466e21200000122233333300400b00f3752004002466
  60104464a66601c600e002266e000040084008dd69809001240006eac0045200
  0222233330053300600400200123222300200330040011225001230042253330
  0700112250011333003300a001222300200313002300b00122253330073375e0
  0460060022446004006244a00244600644a66600c00220062660086012002600
  46014002464600446600400400246004466004004002aae7d5cd2ab9d5742ae8
  88c008dd5000aab9e1`.replace(/\n|\r|\W/g, '').trim();

@Injectable()
export class TransactionService {
  private readonly logger = new Logger(TransactionService.name);

  private readonly LOVELACE = 'lovelace';

  async getSignedNftMintingCbor(seed: string, dto: NftDto): Promise<string> {
    this.logger.log(`Generate signed NFT minting CBOR for: ${dto.walletAddress}`);
    const lct = await this.getLucidTuple({ type: ConstructorType.seed, value: seed });
    const assets = [{ name: dto.assetName, amount: 1 }];
    const transaction = await this.getMintingTransaction(lct, assets, dto.metaData);
    const signedTransaction = await transaction.sign().complete();

    return signedTransaction.toString();
  }

  async getNftMintingCbor(dto: NftDto): Promise<string> {
    this.logger.log(`Generate NFT minting CBOR for: ${dto.walletAddress}`);
    const lct = await this.getLucidTuple({ type: ConstructorType.address, value: dto.walletAddress });
    const assets = [{ name: dto.assetName, amount: 1 }];
    const transaction = await this.getMintingTransaction(lct, assets, dto.metaData);

    return transaction.toString();
  }

  async getSignedAssesMintingCbor(seed: string, dto: AssetDto): Promise<string> {
    this.logger.log(`Generate signed Asset minting CBOR for: ${dto.walletAddress}`);
    const lct = await this.getLucidTuple({ type: ConstructorType.seed, value: seed });
    const transaction = await this.getMintingTransaction(lct, dto.assets);
    const signedTransaction = await transaction.sign().complete();

    return signedTransaction.toString();
  }

  async getAssetsMintingCbor(dto: AssetDto): Promise<string> {
    this.logger.log(`Generate Asset minting CBOR for: ${dto.walletAddress}`);
    const lct = await this.getLucidTuple({ type: ConstructorType.address, value: dto.walletAddress });
    const transaction = await this.getMintingTransaction(lct, dto.assets);

    return transaction.toString();
  }

  async getSignedTransferCbor(seed: string, dto: TransferDto): Promise<string> {
    this.logger.log(`Generate signed Transfer CBOR for: ${dto.walletAddress}`);
    const lct = await this.getLucidTuple({ type: ConstructorType.seed, value: seed });
    const transaction = await this.getTransferTransaction(lct, dto.recipients);
    const signedTransaction = await transaction.sign().complete();

    return signedTransaction.toString();
  }

  async getTransferCbor(dto: TransferDto): Promise<string> {
    this.logger.log(`Generate Transfer CBOR for: ${dto.walletAddress}`);
    const lct = await this.getLucidTuple({ type: ConstructorType.address, value: dto.walletAddress });
    const transaction = await this.getTransferTransaction(lct, dto.recipients);

    return transaction.toString();
  }

  private async getMintingTransaction(lct: LucidTuple, assets: AssetData[], metaData?: MintingMetaData): Promise<TxComplete> {
    if (!assets.length) {
      throw new Error('At lease one asset require');
    }
    const utxos = await this.getUtxos(lct.lucid);
    const collectionSize = assets.reduce((sum, asset) => sum + asset.amount, 0);
    const policy = this.getMintingPolicy(lct.lc, utxos[0], collectionSize);
    const policyId = lct.lucid.utils.mintingPolicyToId(policy);
    const mintAssets = this.getAssets(policyId, assets, lct.lc);
    const transaction = lct.lucid
      .newTx()
      .collectFrom(utxos)
      .mintAssets(mintAssets)
      .attachMintingPolicy(policy);

    if (metaData) {
      transaction.attachMetadata(721,
        this.getMetaData(policyId, assets[0].name, metaData)
      );
    }
    return await transaction.complete();
  }

  private async getTransferTransaction(lct: LucidTuple, recipients: TransferRecipient[]): Promise<TxComplete> {
    if (!recipients.length) {
      throw new Error('At lease one transfer recipient require');
    }
    const transaction = lct.lucid.newTx();

    recipients.forEach((recipient) => {
      const policyId = recipient.policyId ?? '';
      transaction.payToAddress(
        recipient.walletAddress,
        this.getAssets(policyId, [recipient.asset], lct.lc)
      );
    });
    return await transaction.complete();
  }

  private async getUtxos(lucid: Lucid): Promise<UTxO[]> {
    const utxos = await lucid.wallet.getUtxos();
    if (!utxos.length) {
      throw new Error('No utxos in the wallet');
    }
    return utxos;
  }

  private getMintingPolicy(lc: any, utxo: UTxO, collectionSize: number): MintingPolicy {
    const txId = new lc.Constr(0, [utxo.txHash]);
    const txOutRef = new lc.Constr(0, [txId, BigInt(utxo.outputIndex)]);
    const bulkParams = new lc.Constr(0, [txOutRef, BigInt(collectionSize)]);

    return {
      type: 'PlutusV2',
      script: lc.applyParamsToScript(BULK_MINTING_SCRIPT, [bulkParams]),
    };
  }

  private getMetaData(policyId: string, assetName: string, metaData: MintingMetaData): Json {
    return {
      [policyId]: {
        [assetName]: {
          id: 1,
          name: metaData.name,
          description: metaData.description,
          image: metaData.image,
        },
      },
    };
  }

  private getAssets(policyId: string, assets: AssetData[], lc: any): Assets {
    const transactionAssets = assets.map((asset) => {
      if (asset.name === this.LOVELACE) {
        return [this.LOVELACE, BigInt(asset.amount)];
      }
      return [policyId + lc.fromText(asset.name), BigInt(asset.amount)];
    });
    return Object.fromEntries(transactionAssets);
  }

  private async getLucidTuple(wc: WalletConstructor): Promise<LucidTuple> {
    const networkName = process.env.CARDANO_NETWORK.toLocaleLowerCase();
    const lc = await LucidCardano.getImport();
    const lucid = await lc.Lucid.new(
      new lc.Blockfrost(process.env.BLOCKFROST_URL),
      (networkName[0].toUpperCase() + networkName.slice(1)) as Network
    );
    if (wc.type === ConstructorType.seed) {
      lucid.selectWalletFromSeed(wc.value);
    }
    if (wc.type === ConstructorType.address) {
      lucid.selectWalletFrom(wc.value);
    }
    return { lc, lucid };
  }
}
