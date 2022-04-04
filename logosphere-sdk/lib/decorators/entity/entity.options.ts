/* eslint-disable @typescript-eslint/ban-types */
import { CommonOptions } from '../common';
import { StorageLayer } from './entity.types';

/**
 * Entity options object for defining metadata on entity classes.
 */
export type EntityOptions = CommonOptions & {
  /** The Fluree version number of the collection for this schema.  */
  version?: number;

  /** The storage layers where this entity will be persisted. */
  layer?: StorageLayer;

  /**
   * The aggregate root of this entity.
   * If set this implies this entity will only exist so long as its aggregate root exists.
   * */
  root?: Function;
};
