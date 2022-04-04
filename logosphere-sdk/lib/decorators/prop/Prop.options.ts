import { CommonOptions } from '../common';
import { LazyType } from './Prop.types';

export interface PropApiOptions {
  required?: boolean;
  enabled?: boolean;
  examples?: string[];
  readOnly?: boolean;
  writeOnly?: boolean;
}

export interface PropDataOptions {
  index?: boolean;
  unique?: boolean;
  type?: LazyType;
}

export type PropOptions = CommonOptions & PropDataOptions & PropApiOptions;
