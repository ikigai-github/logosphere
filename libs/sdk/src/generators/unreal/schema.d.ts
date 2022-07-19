import { Definition } from '@logosphere/converters';
export interface UnrealEngineGeneratorSchema {
  name?: string;
  module: string;
  directory?: string;
  definition?: Definition;
  index?: Definition[];
  namePrefix?: string;
}
