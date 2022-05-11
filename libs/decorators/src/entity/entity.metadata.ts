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
  root: TypeFunc;
};
