const flureeTransactionActions = ['add', 'update', 'upsert', 'delete'] as const;

export type FlureeTransactAction = typeof flureeTransactionActions[number];
export type FlureeSubjectId = number;
export type FlureeTemporaryId = string;
export type FlureePredicate = string;
export type FlureeReferenceValue = string | number;

/**
 * A Fluree transaction identifier can be a subject id (number), temporary id (string),
 * or a predicate value pair. ([string, string | number ])
 */
export type FlureeTransactIdentifier =
  | FlureeSubjectId
  | FlureeTemporaryId
  | [FlureePredicate, FlureeReferenceValue];

/**
 * An existing identifier cannot include a temporary id
 */
export type FlureeExistingTransactIdentifier = Exclude<
  FlureeTransactIdentifier,
  FlureeTemporaryId
>;

/**
 * Any transact object must have an identifier though it may be a temporary id
 */
export interface FlureeTransactObject {
  _id: FlureeTransactIdentifier;
}

/**
 * Any transaction on an existing object must have an existing identifier
 */
export interface FlureeExistingTransactObject {
  _id: FlureeExistingTransactIdentifier;
}

/**
 * All transactions have an identifier and an action, though it can be implicit
 * the builder has enough context to make it explicit.
 */
export interface FlureeTransaction extends FlureeTransactObject {
  _action: FlureeTransactAction;
}

/**
 * A step that can be built into an array of transactions
 */
export interface FlureeTransactBuildStep {
  /**
   * A step that takes the intermediate form of a transaction and
   * produces an array of FlureeQL transact statements.
   */
  build(): FlureeTransaction[];
}

/**
 * A Guard to confirm the passed object is a valid transact object
 * @param node The node to check if it is a transact object
 * @returns true if the object is a Fluree transact object
 */
export function isFlureeTransactObject(
  node: object
): node is FlureeTransactObject {
  const { _id } = node as FlureeTransactObject;
  if (typeof _id !== 'undefined') {
    if (Array.isArray(_id)) {
      return (
        _id.length === 2 &&
        typeof _id[0] === 'string' &&
        (typeof _id[1] === 'string' || typeof _id[1] === 'number')
      );
    }

    return typeof _id === 'string' || typeof _id === 'number';
  }

  return false;
}

/**
 * A Guard to confirm the passed object is a valid transact object on an existing
 * subject.
 * @param node The node to check if it is a existing transact object
 * @returns true if the object is a Fluree existing transact object
 */
export function isFlureeExistingTransactObject(
  node: object
): node is FlureeExistingTransactObject {
  const { _id } = node as FlureeExistingTransactObject;
  if (typeof _id !== 'undefined') {
    if (Array.isArray(_id)) {
      return (
        _id.length === 2 &&
        typeof _id[0] === 'string' &&
        (typeof _id[1] === 'string' || typeof _id[1] === 'number')
      );
    }

    return typeof _id === 'number';
  }

  return false;
}

/**
 * A Guard to confirm the passed object is a valid transaction
 * @param node The node to verify is a Fluree transaction
 * @returns true if the object is a Fluree transaction
 */
export function isFlureeTransaction(node: object): node is FlureeTransaction {
  if (isFlureeTransactObject(node)) {
    const { _action } = node as FlureeTransaction;
    return (
      typeof _action === 'string' && flureeTransactionActions.includes(_action)
    );
  }
  return false;
}
