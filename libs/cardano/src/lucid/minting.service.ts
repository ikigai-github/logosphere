import { Injectable, Logger } from "@nestjs/common";
// Can be used only as Types. Each callable should be used by inline import
// Otherwise application run will fail by ES module export Errors 
import { Json, Lucid, Network, Script, UTxO } from 'lucid-cardano'
import { MintingDto } from "./minting.dto";


@Injectable()
export class MintingService {

  private readonly logger = new Logger(MintingService.name);

  // Required to prevent ES module export Errors
  private readonly LUCID_CARDANO = "import('lucid-cardano')"
  private readonly VALIDATION_LENGTH = Date.now() + 100000

  async getCbor(seedPhrase: string, dto: MintingDto) {
    this.logger.log(`Generate CBOR for dto: ${dto.header}`)
    const lc = await (eval(this.LUCID_CARDANO) as Promise<any>)
    const lucid = await this.getLucidWallet(seedPhrase, lc)
    const utxos = await this.getUtxos(lucid)
    const policy = await this.getMintingPolicy(lucid)
    const policyId = lucid.utils.mintingPolicyToId(policy)
    const metadata = this.getMetaData(policyId, dto)
    const assetUnit = this.getAssetUnit(policyId, dto.header, lc)

    const transaction = await lucid
      .newTx()
      .collectFrom(utxos)
      .attachMintingPolicy(policy)
      .validTo(this.VALIDATION_LENGTH)
      .attachMetadata(721, metadata)
      .mintAssets(assetUnit)
      .complete();

    return (await transaction.sign().complete()).toString();
  }

  async sendTransaction(cbor: string): Promise<string> {
    this.logger.log(`Sending transaction: ${cbor}`)
    const lc = await (eval(this.LUCID_CARDANO) as Promise<any>)
    return await this.submitTransaction(lc.fromHex(cbor))
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

  private getMetaData(policyId: string, dto: MintingDto): Json {
    return {
      [policyId]: {
        [dto.header]: {
          id: 1,
          name: dto.name,
          description: dto.description,
          image: dto.image
        }
      }
    }
  }

  private getAssetUnit(policyId: string, header: string, lc: any) {
    const assetName = policyId + lc.fromText(header);
    return {
      [assetName]: BigInt(1)
    }
  }

  private async getLucidWallet(seedPhrase: string, lc: any): Promise<Lucid> {
    const networkName = process.env.CARDANO_NETWORK.toLocaleLowerCase()
    const lucid: Lucid = await lc.Lucid.new(
      new lc.Blockfrost(process.env.BLOCKFROST_URL),
      networkName[0].toUpperCase() + networkName.slice(1) as Network
    )
    lucid.selectWalletFromSeed(seedPhrase)
    return lucid;
  }

  private async submitTransaction(binaryData: Uint8Array) {
    return await fetch(process.env.SUBMIT_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/cbor" },
      body: binaryData,
    })
      .then((res) => res.json());
  }

}