import { CommonMetadata } from '../common';
import { StorageLayer } from './entity.types';

/* eslint-disable @typescript-eslint/ban-types */
export type EntityMetadata = CommonMetadata & {
  target: Function;
  version: number;
  layer: StorageLayer;
  root: Function;
};
