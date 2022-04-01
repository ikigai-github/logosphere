import { CommonOptions } from '../common';
import { StorageLayer } from './entity.types';

export type EntityOptions = CommonOptions & {
  version?: number;
  layer?: StorageLayer;
  // eslint-disable-next-line @typescript-eslint/ban-types
  root?: Function;
};
