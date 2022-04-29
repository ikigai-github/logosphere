/* eslint-disable @typescript-eslint/ban-types */
import { CommonMetadata, TypeFunc } from '../common';

// TODO: Add support for storing metadata about class-validator annotations
//     @Min, @Max, @Length, @IsRFC339(), etc...
//     Want to pass those on to the API and database schema where possible
export type PropMetadata = CommonMetadata & {
  index: boolean;
  enabled: boolean;
  unique: boolean;
  primary: boolean;
  required: boolean;
  readOnly: boolean;
  writeOnly: boolean;
  pattern?: string; // TODO: Maybe get this from validator annotations
  minLength?: number;
  maxLength?: number;
  examples?: string[];
  comment?: string;
  externalModule?: string;
  type: TypeFunc;
};

export type PropMetadataMap = Map<string, PropMetadata>;
