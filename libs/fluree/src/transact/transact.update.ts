import {
  FlureeExistingTransactIdentifier,
  FlureePredicateKey,
  FlureePredicateValue,
  FlureeSubjectId,
  FlureeTransactBuildStep,
  FlureeTransaction,
  isFlureeExistingTransactObject,
} from '../fluree.transact.schema';

/**
 * An update Transact pair can be either a predicate value or a subject id
 */
type FlureeUpdateTransactPair = [
  FlureePredicateValue | FlureeSubjectId,
  object
];

/**
 * An update object should contain at the very least an identifier to indicate
 * what object will be updated.
 */
interface FlureeUpdateObject {
  _id: FlureeExistingTransactIdentifier;
}

/**
 * The builder accepts either a subject-object pair or a plain update object.
 * when adding data.
 */
type FlureeUpdateTransactDataInput =
  | FlureeUpdateTransactPair
  | FlureeUpdateObject
  | (FlureeUpdateTransactDataInput | FlureeUpdateObject)[];

/**
 * A Fluree update transact node can have additional data added or be built.
 */
interface FlureeUpdateTransactNode
  extends FlureeTransactBuildStep,
    FlureeUpdateTransactDataStep {}

/**
 * A Fluree update data step supports adding data to the unbuilt transaction
 */
interface FlureeUpdateTransactDataStep {
  /**
   * Accepts a tuple or any data object
   * @param data The data to be added to the transaction
   */
  data<T extends FlureeUpdateTransactDataInput>(
    data: T
  ): FlureeUpdateTransactNode;
}

/**
 * Guard to verify a array is actually a Transact pair tuple
 * @param node The node to verify is a a transact tuple
 * @returns true if the node matches the tuple shape
 */
function isFlureeUpdateTransactPair(
  node: unknown[]
): node is FlureeUpdateTransactPair {
  return (
    node.length === 2 &&
    (typeof node[0] === 'string' || typeof node[0] === 'number') &&
    typeof node[1] === 'object'
  );
}

/**
 * Creates a update id which may be a transact pair or a subject id.
 */
function makeId(
  value: string | number,
  predicate?: FlureePredicateKey
): FlureeExistingTransactIdentifier {
  if (typeof predicate !== 'undefined') {
    return [predicate, value];
  } else if (typeof value === 'number') {
    return value;
  } else {
    throw Error('Cannot make an existing identifier that is just a string');
  }
}

/**
 * Takes input set of tuples or update objects and normalizes them into Fluree Transact
 * @param data The data to be normalized
 * @param predicate The name of the predicate that is being used to select an item for update
 * @returns A normalized array of fluree transactions
 */
function asUpdateTransactions(
  data: FlureeUpdateTransactDataInput,
  predicate?: FlureePredicateKey
): FlureeTransaction[] {
  // Is it an array of input?
  if (Array.isArray(data)) {
    // Is it just a single tuple ie: ['jill', { age: 22 } ]
    if (isFlureeUpdateTransactPair(data)) {
      return [
        { _action: 'update', _id: makeId(data[0], predicate), ...data[1] },
      ];
    } else {
      // Must be an array of either tuples or objects so map them
      return data.map((item) => {
        if (Array.isArray(item) && isFlureeUpdateTransactPair(item)) {
          return {
            _action: 'update',
            _id: makeId(item[0], predicate),
            ...item[1],
          };
        } else if (isFlureeExistingTransactObject(item)) {
          return { _action: 'update', _id: item._id, ...item };
        } else {
          throw Error(
            'Data for creating transaction must either be a tuple [id, data] or include a subject id'
          );
        }
      });
    }
  } else if (isFlureeExistingTransactObject(data)) {
    // Just a single object so map it in by itself
    return [
      {
        _action: 'update',
        _id: data._id,
        ...data,
      },
    ];
  } else {
    throw new Error('The passed object must either pb ');
  }
}

/**
 * The builder stores the intermediate state when creating update transactions.
 */
class FlureeUpdateTransactBuilder implements FlureeUpdateTransactNode {
  private _data: FlureeTransaction[] = [];

  constructor(private _predicate?: FlureePredicateKey) {}

  data<T extends FlureeUpdateTransactDataInput>(
    data: T
  ): FlureeUpdateTransactNode {
    this._data.push(...asUpdateTransactions(data, this._predicate));
    return this;
  }

  build(): FlureeTransaction[] {
    return this._data;
  }
}

/**
 * Creates a builder for creating one or more update fluree transactions
 * @param predicate The name of the predicate used for selecting nodes to update
 * @returns A builder ready to accept update data.
 */
export function update(
  predicate?: FlureePredicateKey
): FlureeUpdateTransactDataStep {
  return new FlureeUpdateTransactBuilder(predicate);
}
