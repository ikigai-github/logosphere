import { Definition } from '@logosphere/converters';
export interface MapperGeneratorSchema {
  name: string;
  module: string;
  directory?: string;
  definition?: Definition;
  index?: Definition[];
}
