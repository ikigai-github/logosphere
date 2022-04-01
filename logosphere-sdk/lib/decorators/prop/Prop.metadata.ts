import { CommonMetadata } from '../common';
import { LazyObjectType } from './Prop.types';

export type PropMetadata = CommonMetadata & {
  index: boolean;
  unique: boolean;
  multi: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Function;
  lazyType: LazyObjectType;
};
