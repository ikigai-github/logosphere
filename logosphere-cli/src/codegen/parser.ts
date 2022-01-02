import { IDefinition, ICanonicalSchema } from './canonical.schema';

export abstract class Parser {
  protected abstract getDefs(schema: any): IDefinition[];

  parse(schema: any): ICanonicalSchema {
    return {
      definitions: this.getDefs(schema),
    };
  }
}
