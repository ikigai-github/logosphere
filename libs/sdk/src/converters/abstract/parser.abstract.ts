import { Definition, CanonicalSchema } from '../../schema';

export abstract class Parser {
  protected abstract getDefs(schema: any): Definition[];

  parse(schema: any): CanonicalSchema {
    const defs = this.getDefs(schema);
    return {
      definitions: defs,
    };
  }
}
