import { Parser } from './parser.abstract';
import { Generator } from './generator.abstract';
import { CanonicalSchema } from './canonical.schema';

export abstract class Converter {
  protected abstract getParser(): Parser;
  protected abstract getGenerator(): Generator;
  public async convert(schema: any): Promise<any> {
    const parser: Parser = this.getParser();
    const generator: Generator = this.getGenerator();
    const canonicalSchema: CanonicalSchema = await parser.parse(schema);
    return generator.generate(canonicalSchema);
  }
}
