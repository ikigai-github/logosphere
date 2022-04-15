import { CommonMetadata, TypeFunc } from '../common';
import { StorageLayer } from './entity.types';

/**
 * The metadata extracted from entity class and decorators
 */
export type EntityMetadata = CommonMetadata & {
  version: number;
  layer: StorageLayer;
  module?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/ban-types
  root: TypeFunc;
};