import * as fs from 'fs';
import { GqlGenerator } from './gql.generator';
import { CanonicalSchema } from '../../schema';
import { JsonSchemaParser } from '../json-schema';
describe('Test GQL generator', () => {
  it('should generate valid GQL', () => {
    const parser = new JsonSchemaParser();
    const jsonSchema = JSON.parse(
      fs.readFileSync(`${__dirname}/../json-schema/json-schema.json`, 'utf-8')
    );
    const canonical: CanonicalSchema = parser.parse(jsonSchema);

    const generator = new GqlGenerator();
    const gql = generator.generate(canonical);
    expect(gql).toBeDefined();
  });
});
