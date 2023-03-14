import { Injectable, Logger } from "@nestjs/common";
// Can be used only as Types. Each callable should be used by inline import
// Otherwise application run will fail by ES module export Errors 
import { Assets, Json, Lucid, Network, Script, TxComplete, UTxO } from 'lucid-cardano'
import { AssetData, AssetDto, MintingMetaData, NftDto, TransferDto, TransferRecipient } from "./minting.models";
import { LUCID_CARDANO } from "./defaults";


type LucidTuple = { lc: any, lucid: Lucid }


@Injectable()
export class TransactionService {

  private readonly logger = new Logger(TransactionService.name);

  private readonly VALIDATION_LENGTH = Date.now() + Number(process.env.CARDANO_MINTING_VALIDATION_LENGTH);
  private readonly LOVELACE = 'lovelace'

  async getSignedNftMintingCbor(seed: string, dto: NftDto): Promise<string> {
    this.logger.log(`Generate signed NFT minting CBOR for: ${dto.walletAddress}`)
    const lct = await this.getLucidFromSeed(seed)
    const assets = [{ name: dto.assetName, amount: 1 }]
    const transaction = await this.getMintingTransaction(lct, assets, dto.metaData)
    const signedTransaction = await transaction.sign().complete()

    return signedTransaction.toString()
  }

  async getNftMintingCbor(dto: NftDto): Promise<string> {
    this.logger.log(`Generate NFT minting CBOR for: ${dto.walletAddress}`)
    const lct = await this.getLucidFromAddress(dto.walletAddress)
    const assets = [{ name: dto.assetName, amount: 1 }]
    const transaction = await this.getMintingTransaction(lct, assets, dto.metaData)

    return transaction.toString()
  }

  async getSignedAssesMintingCbor(seed: string, dto: AssetDto): Promise<string> {
    this.logger.log(`Generate signed Asset minting CBOR for: ${dto.walletAddress}`)
    const lct = await this.getLucidFromSeed(seed)
    const transaction = await this.getMintingTransaction(lct, dto.assets)
    const signedTransaction = await transaction.sign().complete()

    return signedTransaction.toString()
  }

  async getAssetsMintingCbor(dto: AssetDto): Promise<string> {
    this.logger.log(`Generate Asset minting CBOR for: ${dto.walletAddress}`)
    const lct = await this.getLucidFromAddress(dto.walletAddress)
    const transaction = await this.getMintingTransaction(lct, dto.assets)

    return transaction.toString()
  }

  async getSignedTransferCbor(seed: string, dto: TransferDto): Promise<string> {
    this.logger.log(`Generate signed Transfer CBOR for: ${dto.walletAddress}`)
    const lct = await this.getLucidFromSeed(seed)
    const transaction = await this.getTransferTransaction(lct, dto.recipients)
    const signedTransaction = await transaction.sign().complete()

    return signedTransaction.toString()
  }

  async getTransferCbor(dto: TransferDto): Promise<string> {
    this.logger.log(`Generate Transfer CBOR for: ${dto.walletAddress}`)
    const lct = await this.getLucidFromAddress(dto.walletAddress)
    const transaction = await this.getTransferTransaction(lct, dto.recipients)

    return transaction.toString()
  }

  private async getLucidFromSeed(seed: string): Promise<LucidTuple> {
    // Required to prevent ES module export Errors
    const lc = await (eval(LUCID_CARDANO) as Promise<any>)
    const lucid = (await this.getLucid(lc)).selectWalletFromSeed(seed)
    return ({ lc, lucid })
  }

  private async getLucidFromAddress(address: string): Promise<LucidTuple> {
    // Required to prevent ES module export Errors
    const lc = await (eval(LUCID_CARDANO) as Promise<any>)
    const lucid = (await this.getLucid(lc)).selectWalletFrom({ address })
    return ({ lc, lucid })
  }

  private async getMintingTransaction(lct: LucidTuple, assets: AssetData[], metaData?: MintingMetaData): Promise<TxComplete> {
    if (!assets.length) {
      throw new Error('At lease one asset require')
    }
    const utxos = await this.getUtxos(lct.lucid)
    const policy = await this.getMintingPolicy(lct.lucid)
    const policyId = lct.lucid.utils.mintingPolicyToId(policy)
    const mintAssets = this.getAssets(policyId, assets, lct.lc)
    const transaction = lct.lucid
      .newTx()
      .collectFrom(utxos)
      .mintAssets(mintAssets)
      .attachMintingPolicy(policy)
      .validTo(this.VALIDATION_LENGTH)

    if (metaData) {
      transaction.attachMetadata(721,
        this.getMetaData(policyId, assets[0].name, metaData)
      )
    }
    return await transaction.complete()
  }

  private async getTransferTransaction(lct: LucidTuple, recipients: TransferRecipient[]): Promise<TxComplete> {
    if (!recipients.length) {
      throw new Error('At lease one transfer recipient require')
    }
    const transaction = lct.lucid.newTx()

    recipients.forEach(recipient => {
      const policyId = recipient.policyId ?? ''
      transaction.payToAddress(
        recipient.walletAddress,
        this.getAssets(policyId, [recipient.asset], lct.lc)
      )
    })
    return await transaction.complete()
  }

  private async getUtxos(lucid: Lucid): Promise<UTxO[]> {
    const utxos = await lucid.wallet.getUtxos()
    if (!utxos.length) {
      throw new Error('No utxos in the wallet');
    }
    return utxos
  }

  private async getMintingPolicy(lucid: Lucid): Promise<Script> {
    const walletAddress = await lucid.wallet.address()
    const { paymentCredential } = lucid.utils.getAddressDetails(walletAddress);

    return lucid.utils.nativeScriptFromJson(
      {
        type: "all",
        scripts: [
          {
            type: "sig",
            keyHash: paymentCredential.hash
          },
          {
            type: "before",
            slot: lucid.utils.unixTimeToSlot(this.VALIDATION_LENGTH),
          },
        ],
      },
    );
  }

  private getMetaData(policyId: string, assetName: string, metaData: MintingMetaData): Json {
    return {
      [policyId]: {
        [assetName]: {
          id: 1,
          name: metaData.name,
          description: metaData.description,
          image: metaData.image
        }
      }
    }
  }

  private getAssets(policyId: string, assets: AssetData[], lc: any): Assets {
    const transactionAssets = assets.map(asset => {
      if (asset.name === this.LOVELACE) {
        return [this.LOVELACE, BigInt(asset.amount)]
      }
      return [policyId + lc.fromText(asset.name), BigInt(asset.amount)]
    })
    return Object.fromEntries(transactionAssets)
  }


  private async getLucid(lc: any): Promise<Lucid> {
    const networkName = process.env.CARDANO_NETWORK.toLocaleLowerCase()
    return await lc.Lucid.new(
      new lc.Blockfrost(process.env.BLOCKFROST_URL),
      networkName[0].toUpperCase() + networkName.slice(1) as Network
    )
  }

}