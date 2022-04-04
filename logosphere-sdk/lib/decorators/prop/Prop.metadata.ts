/* eslint-disable @typescript-eslint/ban-types */
import { CommonMetadata } from '../common';
import { LazyType } from './Prop.types';

// TODO: Add support for storing metadata about class-validator annotations
//     @Min, @Max, @Length, @IsRFC339(), etc...
//     Want to pass those on to the API and database schema where possible
export type PropMetadata = CommonMetadata & {
  index: boolean;
  unique: boolean;
  required: boolean;
  examples: string[];
  readOnly?: boolean;
  writeOnly?: boolean;
  target: Object;
  type: LazyType;
};

export type PropMetadataMap = Map<string | symbol, PropMetadata>;
