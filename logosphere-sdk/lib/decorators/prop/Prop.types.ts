import { AnyParamConstructor, DeferredFunc } from '../common/common.types';

// eslint-disable-next-line @typescript-eslint/ban-types

export type LazyType =
  | DeferredFunc<AnyParamConstructor<any>>
  | DeferredFunc<unknown>;
