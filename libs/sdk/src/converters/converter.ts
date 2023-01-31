import { Parser } from './abstract/parser.abstract';
import { Generator } from './abstract/generator.abstract';
import { CanonicalSchema } from '../schema';

export class Converter {
  constructor(
    protected readonly parser: Parser,
    protected readonly generator: Generator
  ) {}

  public convert(schema: any): any {
    const canonicalSchema: CanonicalSchema = this.parser.parse(schema);
    return this.generator.generate(canonicalSchema);
  }
}
