import { Definition } from '@logosphere/converters';
export interface DtoGeneratorSchema {
  name?: string;
  module: string;
  directory?: string;
  definition?: Definition;
  index?: Definition[];
}
