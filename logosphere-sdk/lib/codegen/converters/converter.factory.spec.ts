import { ConverterFactory } from './converter.factory';
import { Converter } from '../converter.abstract';
import { SchemaType } from '../schema-type';
describe('Converter factory test', () => {
  it('should return JsonToGqlConverter', () => {
    const converter: Converter = ConverterFactory.getConverter(SchemaType.Json, SchemaType.Gql);
    expect(converter).toBeDefined();
  });

  it('should return JsonToGqlFederatedConverter', () => {
    const converter: Converter = ConverterFactory.getConverter(SchemaType.JsonFederated, SchemaType.GqlFederated);
    expect(converter).toBeDefined();
  });

  it('should throw exception when target converter is not implemented', () => {
    expect(() => { ConverterFactory.getConverter(SchemaType.Gql, SchemaType.Json)}).toThrow();
  });
});