import { Definition } from '@logosphere/converters';
export interface ResolverGeneratorSchema {
  name?: string;
  module: string;
  directory?: string;
  definition?: Definition;
  index?: Definition[];
}
