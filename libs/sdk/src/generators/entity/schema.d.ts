import { Definition } from '@logosphere/converters';
export interface EntityGeneratorSchema {
  name?: string;
  module: string;
  directory?: string;
  source?: string;
  definition?: Definition;
}
