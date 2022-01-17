import { ConverterFactory } from './converter.factory';
import { Converter } from './converter';
import { SchemaType } from './schema-type';
describe('Converter factory test', () => {
  it('should return converter', () => {
    const converter: Converter = ConverterFactory.getConverter(
      SchemaType.Json,
      SchemaType.Gql
    );
    expect(converter).toBeDefined();
  });

  it('should throw exception when target converter is not implemented', () => {
    expect(() => {
      ConverterFactory.getConverter(SchemaType.Gql, SchemaType.Json);
    }).toThrow();
  });
});