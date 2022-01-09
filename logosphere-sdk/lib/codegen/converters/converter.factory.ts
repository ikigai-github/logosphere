import { SchemaType } from '../schema-type';
import { Converter } from '../converter.abstract';
import { JsonSchemaToGqlConverter, JsonSchemaToGqlFederatedConverter } from './json-schema-to-gql';
export class ConverterFactory {
  static getConverter(sourceSchemaType: SchemaType, targetSchemaType: SchemaType): Converter {
    switch (sourceSchemaType) {
      case SchemaType.Json:
        switch (targetSchemaType) {
          case SchemaType.Gql:     
            return new JsonSchemaToGqlConverter();
          default:
            throw new Error(`${sourceSchemaType} to ${targetSchemaType} converter not implemented.`)
        }
      case SchemaType.JsonFederated:
        switch (targetSchemaType) {
          case SchemaType.GqlFederated:
            return new JsonSchemaToGqlFederatedConverter();
          default:
            throw new Error(`${sourceSchemaType} to ${targetSchemaType} converter not implemented.`)
        }
      default:
        throw new Error(`There are no converters from ${sourceSchemaType} implemented`);

    }
  }
}