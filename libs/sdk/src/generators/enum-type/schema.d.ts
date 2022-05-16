import { Definition } from '@logosphere/converters';
export interface EnumTypeGeneratorSchema {
  name: string;
  module: string;
  directory?: string;
  definition?: Definition;
  index?: Definition[];
}
