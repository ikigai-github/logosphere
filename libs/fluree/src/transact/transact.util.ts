let globalFlureeTempIdHandle = 0;

/**
 * Creates a temporary identifier to be used in FlureeQL when adding data.
 * @param collection The collection to prepend the id with
 * @param handle A custom identifier to use
 * @returns A tempoerary identifier
 */
export function makeId(collection: string, handle?: string | number): string {
  if (typeof handle === 'undefined') {
    handle = globalFlureeTempIdHandle++;
  }
  return `${collection}$${handle}`;
}

/**
 * Converts a predicate name and value pair into a tuple used as a reference id
 * @param predicate The name of the predicate
 * @param value The selecting value of the predicate
 * @returns A tuple of length 2 containg the predicate and value
 */
export function id(
  predicate: string,
  value: string | number
): [string, string | number] {
  return [predicate, value];
}
