import { Definition } from '@logosphere/converters';
export interface RepositoryGeneratorSchema {
  name: string;
  module: string;
  directory?: string;
  definition?: Definition;
  index?: Definition[];
  type: string;
}
