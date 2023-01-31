import { Definition, CanonicalSchema } from '../../schema';
import { Parser } from '../abstract/parser.abstract';

export class CanonicalSchemaParser extends Parser {
  protected getDefs(schema: CanonicalSchema): Definition[] {
    return schema.definitions;
  }
}
