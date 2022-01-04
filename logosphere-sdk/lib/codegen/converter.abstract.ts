import { Parser } from './parser.abstract';
import { Generator } from './generator.abstract';
import { ICanonicalSchema } from './canonical.schema';

export abstract class Converter {
  protected abstract getParser(): Parser;
  protected abstract getGenerator(): Generator;
  convert(schema: any): any {
    console.log('inside converter');
    const parser: Parser = this.getParser();
    const generator: Generator = this.getGenerator();
    const canonicalSchema: ICanonicalSchema = parser.parse(schema);
    return generator.generate(canonicalSchema);
  }
}
