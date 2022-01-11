import * as fs from 'fs';
import { FlureeGenerator } from './fluree.generator';
import { CanonicalSchema } from '../canonical.schema';
import { JsonSchemaParser } from '../json-schema';

describe('Fluree Generator', () => {
  it('should generate Fluree collections schema', () => {
    const parser = new JsonSchemaParser();
    const jsonSchema = JSON.parse(fs.readFileSync(`${__dirname}/../../../test/fixtures/schemas/monolith/json-schema.json`, 'utf-8'));
    const canonical = parser.parse(jsonSchema);
    //console.log(JSON.stringify(canonical));
    const generator = new FlureeGenerator();
    const fql = generator.generate(canonical);
    expect(fql).toBeDefined();
    expect(fql.length > 0).toBe(true);
    //console.log(`FQL: ${fql}`);
  });
});
