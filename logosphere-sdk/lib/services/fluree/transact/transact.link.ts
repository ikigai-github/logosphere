import {
  FlureeTransactIdentifier,
  FlureeTransactObject,
} from '../fluree.transact.schema';
import { makeId } from './transact.util';

type FlureeLinkType = 'link';

interface FlureeLinkNode {
  $$kind: FlureeLinkType;
  build(): FlureeTransactIdentifier | FlureeTransactObject;
}

interface FlureeLinkDataNode {
  data(linkData: object): FlureeLinkNode;
}

export function isFlureeLinkNode(node: any) {
  return typeof node === 'object' && (node as FlureeLinkNode).$$kind === 'link';
}

class FlureeLinkBuilder implements FlureeLinkNode, FlureeLinkDataNode {
  $$kind: FlureeLinkType = 'link';
  private _id: FlureeTransactIdentifier;
  private _data?: object;

  constructor(
    collectionOrPredicate: string,
    predicateValueOrData?: string | number | object
  ) {
    const [collection, predicate] = collectionOrPredicate.split('/');
    if (typeof predicate !== 'undefined') {
      if (
        typeof predicateValueOrData === 'undefined' ||
        typeof predicateValueOrData === 'object'
      ) {
        throw Error(
          'Must specify a string or number when creating a reference ie link("person/name", "John")'
        );
      }
      this._id = [collectionOrPredicate, predicateValueOrData];
    } else {
      if (typeof predicateValueOrData === 'object') {
        this._data = predicateValueOrData;
      }
      this._id = makeId(collection);
    }
  }

  build(): FlureeTransactIdentifier | FlureeTransactObject {
    if (this._data) {
      const built = { _id: this._id };
      Object.entries(this._data).forEach(([key, value]) => {
        if (isFlureeLinkNode(value)) {
          built[key] = value.build();
        } else {
          built[key] = value;
        }
      });
      return built;
    } else {
      return this._id;
    }
  }

  data(linkData: object): FlureeLinkNode {
    this._data = linkData;
    return this;
  }
}

export function child(collection: string, data: object): FlureeLinkNode {
  return new FlureeLinkBuilder(collection, data);
}

export function link(
  collectionOrPredicate: string,
  predicateValue?: string | number
): FlureeLinkDataNode {
  return new FlureeLinkBuilder(collectionOrPredicate, predicateValue);
}
