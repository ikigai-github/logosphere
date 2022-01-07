import { Generator } from '../../generator.abstract';
import { Parser } from '../../parser.abstract';
import { Converter } from '../../converter.abstract';
export class JsonSchemaToGqlFederatedConverter extends Converter {
  protected getParser(): Parser {
    throw new Error('Method not implemented.');
  }
  protected getGenerator(): Generator {
    throw new Error('Method not implemented.');
  }

  convert(schema: any): any {
    
  }
}