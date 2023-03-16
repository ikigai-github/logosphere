import { Injectable, Logger } from '@nestjs/common';
import { LucidCardano } from './lucid.cardano';

@Injectable()
export class SubmitService {
  private readonly logger = new Logger(SubmitService.name);

  async submit(cbor: string): Promise<string> {
    this.logger.log(`Submitting transaction: ${cbor.slice(0, 10)} ... ${cbor.slice(-10)}`);
    const lc = await LucidCardano.getImport();
    return await this.submitTransaction(lc.fromHex(cbor));
  }

  private async submitTransaction(binaryData: Uint8Array) {
    return await fetch(process.env.CARDANO_SUBMIT_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/cbor' },
      body: binaryData,
    }).then((res) => res.json());
  }
}
