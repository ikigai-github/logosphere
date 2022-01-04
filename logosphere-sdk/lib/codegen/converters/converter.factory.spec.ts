import { ConverterFactory } from './converter.factory';
import { Converter } from '../converter.abstract';
import { SchemaType } from '../schema-type';
describe('Converter factory test', () => {
  it('should return JsonToGqlConverter', () => {
    const converter: Converter = ConverterFactory.getConverter(SchemaType.JSON, SchemaType.GQL);
    expect(converter).toBeDefined();
  });

  it('should throw exception when target converter is not implemented', () => {
    expect(() => { ConverterFactory.getConverter(SchemaType.GQL, SchemaType.JSON)}).toThrow();
  });
});