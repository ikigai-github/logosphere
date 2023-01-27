import { CanonicalSchema } from '../../schema';
export interface GqlGeneratorSchema {
  module: string;
  tags?: string;
  directory?: string;
  source?: string;
  sourceSchema?: CanonicalSchema;
}
