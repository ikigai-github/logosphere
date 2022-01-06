import { Converter } from '../../converter';
import { JsonSchemaParser } from '../../json-schema/json-schema.parser';
import { GqlGenerator } from '../../gql/gql.generator';
export class JsonSchemaToGqlConverter extends Converter {
  protected getParser(): JsonSchemaParser {
    return new JsonSchemaParser();
  }
  protected getGenerator(): GqlGenerator {
    return new GqlGenerator();
  }
}
