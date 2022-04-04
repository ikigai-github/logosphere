/* eslint-disable @typescript-eslint/ban-types */
import { CommonMetadata } from '../common';
import { StorageLayer } from './entity.types';

/**
 * The metadata extracted from entity class and decorators
 */
export type EntityMetadata = CommonMetadata & {
  target: Function;
  version: number;
  layer: StorageLayer;
  root: Function;
};
