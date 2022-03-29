import { sha3_256 } from 'js-sha3';
import { constants as c } from './common.constants';


/**
 * Prints debug statement to the console
 */
 export function debug(message: string, object: any): void {
  if (c.DEBUG) {
      console.log('-'.repeat(10))
      console.log(`DEBUG: ${message}`)
      console.log(JSON.stringify(object))
      console.log('-'.repeat(10))
  }
}

export function createIdentifier(data: any): string {
  return sha3_256(JSON.stringify(data).concat(Date.now().toString()));
}