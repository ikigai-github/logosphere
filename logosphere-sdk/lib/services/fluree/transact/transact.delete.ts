import {
  FlureeExistingTransactIdentifier,
  FlureeTransaction,
} from './transact.schema';

interface FlureeRemoveIdStep {
  id(id: FlureeExistingTransactIdentifier): FlureeRemoveBuilder;
}

class FlureeRemoveBuilder implements FlureeRemoveIdStep {
  private _ids: FlureeExistingTransactIdentifier[] = [];

  id(id: FlureeExistingTransactIdentifier): FlureeRemoveBuilder {
    this._ids.push(id);
    return this;
  }

  build(): FlureeTransaction[] {
    return this._ids.map((id) => ({ _action: 'delete', _id: id }));
  }
}

export function remove(): FlureeRemoveIdStep {
  return new FlureeRemoveBuilder();
}
