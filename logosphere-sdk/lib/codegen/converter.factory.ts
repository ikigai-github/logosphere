import { SchemaType } from './schema-type';
import { Converter } from './converter';
import { JsonSchemaParser, JsonFederatedSchemaParser } from './json-schema';
import { GqlFederatedGenerator } from './gql';
import { FlureeGenerator } from './fluree';
import { DtoGenerator } from './dto';

export class ConverterFactory {
  static getConverter(
    sourceSchemaType: SchemaType,
    targetSchemaType: SchemaType
  ): Converter {
    switch (sourceSchemaType) {
      case SchemaType.Json:
        switch (targetSchemaType) {
          case SchemaType.Gql:
            return new Converter(
              new JsonFederatedSchemaParser(),
              new GqlFederatedGenerator()
            );
          case SchemaType.Fluree:
            return new Converter(new JsonSchemaParser(), new FlureeGenerator());
          case SchemaType.Dto:
            return new Converter(new JsonSchemaParser(), new DtoGenerator());
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
