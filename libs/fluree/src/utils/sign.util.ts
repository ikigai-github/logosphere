import { configure } from 'safe-stable-stringify';
import { createHash } from 'crypto';

/**
 * Stable stringify needed for ensuring equivalent serialized JSON
 * always produces the same string.
 */
export const stringify = configure({
  bigint: true,
  circularValue: undefined,
  deterministic: true,
});

/**
 * Hashes the a string using sha256 and returns it as a hex string
 * @param serializedCommand A Fluree command that has been serialized as a string
 * @returns The sha256 hash of the passed in serialized command string as a hex string
 */
export function hash(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}
