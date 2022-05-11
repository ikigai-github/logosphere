/* eslint-disable @typescript-eslint/no-explicit-any */
import { sha3_256 } from 'js-sha3';
import { Identifier } from './identifier';

export class SHA256Identifier extends Identifier<string> {
  constructor(obj: any) {
    const regex = new RegExp('[A-Fa-f0-9]{64}');
    if (typeof obj === 'string' && regex.test(obj.toString())) {
      super(obj.toString());
    } else {
      super(
        sha3_256(
          JSON.stringify(obj).concat((Date.now() + Math.random()).toString())
        )
      );
    }
  }
}
