import { CommonMetadata, TypeFunc } from '../common';
import { StorageLayer } from './entity.types';

/**
 * The metadata extracted from entity class and decorators
 */
export type EntMetadata = CommonMetadata & {
  version: number;
  layer: StorageLayer;
  module?: string;
  description?: string;
  nft?: boolean;
  root: TypeFunc;
};
