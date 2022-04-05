import { CommonMetadata, AnyParamConstructor } from '../common';
import { StorageLayer } from './entity.types';

/**
 * The metadata extracted from entity class and decorators
 */
export type EntityMetadata = CommonMetadata & {
  version: number;
  layer: StorageLayer;
  root: AnyParamConstructor;
};
