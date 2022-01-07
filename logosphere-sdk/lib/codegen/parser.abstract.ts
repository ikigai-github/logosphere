import { IDefinition, ICanonicalSchema } from './canonical.schema';

export abstract class Parser {
  protected abstract getDefs(schema: any): IDefinition[] | Promise<IDefinition[]>;

  async parse(schema: any): Promise<ICanonicalSchema>  {
    const defs = await this.getDefs(schema);
    return {
      definitions: defs,
    };
  }
}
