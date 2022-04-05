import { CommonMetadata, DeferredFunc } from '../common';

// TODO: Add support for storing metadata about class-validator annotations
//     @Min, @Max, @Length, @IsRFC339(), etc...
//     Want to pass those on to the API and database schema where possible
export type PropMetadata = CommonMetadata & {
  index: boolean;
  unique: boolean;
  required: boolean;
  examples?: string[];
  readOnly?: boolean;
  writeOnly?: boolean;
  type: DeferredFunc;
};

export type PropMetadataMap = Map<string, PropMetadata>;
