import * as fs from 'fs';
import { FlureeGenerator } from './fluree.generator';
import { JsonSchemaParser } from '../json-schema';

describe('Fluree Generator', () => {
  it('should generate Fluree collections schema', () => {
    const parser = new JsonSchemaParser();
    const jsonSchema = JSON.parse(
      fs.readFileSync(
        `${__dirname}/../../../test/fixtures/schema-first/schemas/monolith/json-schema.json`,
        'utf-8'
      )
    );
    const canonical = parser.parse(jsonSchema);
    const generator = new FlureeGenerator();
    const fql = generator.generate(canonical);
    expect(fql).toBeDefined();
    expect(fql.length > 0).toBe(true);
  });
});
