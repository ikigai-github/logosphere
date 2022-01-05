import { SchemaType } from '../schema-type';
import { Converter } from '../converter.abstract';
import { JsonSchemaToGqlConverter } from './json-schema-to-gql/json-schema-to-gql.converter';
export class ConverterFactory {
  static getConverter(sourceSchemaType: SchemaType, targetSchemaType: SchemaType): Converter {
    switch (sourceSchemaType) {
      case SchemaType.JSON:
        switch (targetSchemaType) {
          case SchemaType.GQL:
            
            return new JsonSchemaToGqlConverter();
          default:
            throw new Error(`${sourceSchemaType} to ${targetSchemaType} converter not implemented.`)
        }
      default:
        throw new Error(`There are no converters from ${sourceSchemaType} implemented`);

    }
  }
}