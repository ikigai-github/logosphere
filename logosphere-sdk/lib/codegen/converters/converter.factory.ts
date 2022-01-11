import { SchemaType } from '../schema-type';
import { Converter, JsonSchemaToGqlFederatedConverter } from '../converters';
import { JsonSchemaFederatedParser } from '../json-schema';
import { GqlGenerator } from '../gql';

export class ConverterFactory {
  static getConverter(
    sourceSchemaType: SchemaType,
    targetSchemaType: SchemaType
  ): Converter {
    switch (sourceSchemaType) {
      case SchemaType.Json:
        switch (targetSchemaType) {
          case SchemaType.Gql:
            return new JsonSchemaToGqlFederatedConverter(new JsonSchemaFederatedParser(), new GqlGenerator());
          default:
            throw new Error(
              `${sourceSchemaType} to ${targetSchemaType} converter not implemented.`
            );
        }
      default:
        throw new Error(
          `There are no converters from ${sourceSchemaType} implemented`
        );
    }
  }
}
