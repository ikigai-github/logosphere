import { Definition, CanonicalSchema } from './canonical.schema';

export abstract class Parser {
  protected abstract getDefs(schema: any): Definition[] | Promise<Definition[]>;

  async parse(schema: any): Promise<CanonicalSchema>  {
    const defs = await this.getDefs(schema);
    return {
      definitions: defs,
    };
  }
}
