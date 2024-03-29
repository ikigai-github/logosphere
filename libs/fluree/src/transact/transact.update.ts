/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  FlureeExistingTransactIdentifier,
  FlureePredicateKey,
  FlureePredicateValue,
  FlureeSubjectId,
  FlureeTransactBuildStep,
  FlureeTransaction,
  isFlureeExistingTransactObject,
} from './transact.schema';

function isScalarArray(input: any[]): boolean {
  if (Array.isArray(input)) {
    let scalar = true;
    input.map((item: any) => {
      if (typeof item === 'object') scalar = false;
    });
    return scalar;
  } else {
    return false;
  }
}

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

function createRef(id: string) {
  if (typeof id === 'string' && id.indexOf('$') > -1) {
    const arrId = id.split('$');
    return [`${arrId[0]}/identifier`, arrId[1]];
  } else {
    return id;
  }
}

/**
 * Flattens the hierarchical nested transact JSON which works in Fluree
 * for inserts, but doesn't work for updates.
 * @param spec Transact spec
 * @returns Flat transact spec
 */
export function processUpdateTransactSpec(
  spec: any[],
  updateTransact = [],
  createTransact = []
) {
  spec.map((t: any) => {
    const tr = {};
    Object.keys(t).map((key: string) => {
      if (
        typeof t[key] === 'object' &&
        !Array.isArray(t[key]) &&
        typeof t[key]['_id'] === 'number'
      ) {
        processUpdateTransactSpec([t[key]], updateTransact, createTransact);
        tr[key] = createRef(t[key]['_id']);
      } else if (Array.isArray(t[key]) && !isScalarArray(t[key])) {
        t[key].map((a: any) => {
          if (typeof a === 'object') {
            processUpdateTransactSpec([a], updateTransact, createTransact);
          }
        });
        tr[key] = t[key].map((a: any) => createRef(a['_id']));
      } else if (
        typeof t[key] === 'object' &&
        !Array.isArray(t[key]) &&
        typeof t[key]['_id'] === 'string' &&
        t[key]['_id'].indexOf('$') > -1
      ) {
        tr[key] = createRef(t[key]['_id']);
        createTransact.push(t[key]);
      } else {
        tr[key] = t[key];
      }
    });
    typeof tr['_id'] === 'number'
      ? updateTransact.push(tr)
      : createTransact.push(tr);
  });
}

/**
 * Fluree has a "feature", when update transact doesn't delete items from arrays / multi predicates
 * The workaround is to explicitly delete them with _delete statement
 * @param updateSpec Update transact spec
 * @param existingSpec Existing spec. Reflects the current state of the ledger
 * @returns updated spec with reconciled multi-predicates / arrays
 */
export function reconcileArrays(updateSpec: any[], existingSpec: any[]): any[] {
  existingSpec.map((t: any) => {
    Object.keys(t).map((key: string) => {
      if (isScalarArray(t[key])) {
        const newSpec = updateSpec.find((tr: any) => tr['_id'] === t['_id']);
        if (newSpec) {
          const newArr = newSpec[key];
          const existingArr = t[key];
          const deleted = existingArr.filter(
            (item) => newArr.indexOf(item) < 0
          );
          if (deleted) {
            updateSpec.push({
              _id: t['_id'],
              _action: 'delete',
              [key]: deleted,
            });
          }
        }
      }
    });
  });
  return updateSpec;
}
