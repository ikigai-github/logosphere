import { Parser } from './parser.abstract';
import { Generator } from './generator.abstract';
import { CanonicalSchema } from './canonical.schema';

export abstract class Converter {
  protected abstract getParser(): Parser;
  protected abstract getGenerator(): Generator;
  public convert(schema: any): any {
    const parser: Parser = this.getParser();
    const generator: Generator = this.getGenerator();
    const canonicalSchema: CanonicalSchema = parser.parse(schema);
    return generator.generate(canonicalSchema);
  }
}
