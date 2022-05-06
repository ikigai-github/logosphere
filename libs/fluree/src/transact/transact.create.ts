import { isFlureeLinkNode } from './transact.link';
import {
  FlureeTransactBuildStep,
  FlureeTransactIdentifier,
  FlureeTransaction,
} from './transact.schema';
import { makeId } from './transact.util';

/**
 * For creation the subject id doesn't exist so exclude it as an option
 */
type FlureeCreateTransactIdentifier = Exclude<FlureeTransactIdentifier, number>;

/**
 * A tuple for a create statement where the first item is the id and the second
 * is the data to create.
 */
type FlureeCreateTransactPair = [FlureeCreateTransactIdentifier, object];

/**
 * Creating input can be tuples or plain object which can optionally be in an array
 */
type FlureeCreateTransactDataInput =
  | FlureeCreateTransactPair
  | object
  | (FlureeCreateTransactPair | object)[];

/**
 * A transact step that is both buildable and can have data added to it.
 */
interface FlureeCreateTransactNode
  extends FlureeTransactBuildStep,
    FlureeCreateTransactDataStep {}

/**
 * A transact step that supports adding data
 */
interface FlureeCreateTransactDataStep {
  /**
   * Stores the intermediate transaction data in the builder
   * @param data The data to be stored
   */
  data(data: FlureeCreateTransactDataInput): FlureeCreateTransactNode;
}

/**
 * Guard for confirming a tuple matches the transact pair structure
 * @param node The potential transact pair
 * @returns true if the tuple matches the expected shape
 */
function isFlureeCreateTransactPair(
  node: unknown[]
): node is FlureeCreateTransactPair {
  return (
    node.length === 2 &&
    typeof node[0] === 'string' &&
    typeof node[1] === 'object'
  );
}

/**
 * Takes data input which may be objects or tuples and normalizes them
 * to the FlureeQL create transaction structure.
 * @param collection The name of the collection data is being added to
 * @param data The data to add to the collection
 * @returns An array of transactions for adding data to a collection
 */
function asCreateTransactions(
  collection: string,
  data: FlureeCreateTransactDataInput
): FlureeTransaction[] {
  // Is it an array of input?
  if (Array.isArray(data)) {
    // Is it just a single tuple ie: ['person$john', { name: john} ]
    if (isFlureeCreateTransactPair(data)) {
      return [{ _action: 'add', _id: data[0], ...data[1] }];
    } else {
      // Must be an array of either tuples or objects so map them
      return data.map((item) => {
        if (Array.isArray(item) && isFlureeCreateTransactPair(item)) {
          return { _action: 'add', _id: item[0], ...item[1] };
        } else {
          return { _action: 'add', _id: makeId(collection), ...item };
        }
      });
    }
  } else {
    // Just a single object so map it in by itself
    return [
      {
        _action: 'add',
        _id: makeId(collection),
        ...data,
      },
    ];
  }
}

/**
 * The builder olds the intermediate state while creating a create transaction
 */
class FlureeCreateTransactBuilder implements FlureeCreateTransactNode {
  private _data: FlureeTransaction[] = [];

  constructor(private _collection: string) {}

  data(data: FlureeCreateTransactDataInput): FlureeCreateTransactNode {
    this._data.push(...asCreateTransactions(this._collection, data));
    return this;
  }

  /**
   * Takes the intermediate state and builds any nested transactions.
   * @returns A FlureeQL transaction array
   */
  build(): FlureeTransaction[] {
    return this._data.map((item) => {
      const transaction = {};
      Object.entries(item).map(([key, value]) => {
        if (isFlureeLinkNode(value)) {
          transaction[key] = value.build();
        } else {
          transaction[key] = value;
        }
      });
      return transaction as FlureeTransaction;
    });
  }
}

/**
 * This function creates a builder for creating a set FlureeQL create transactions.
 * @param collection The name of collection to create data under
 * @returns A builder for adding data to the collection
 */
export function create(collection: string): FlureeCreateTransactDataStep {
  return new FlureeCreateTransactBuilder(collection);
}
