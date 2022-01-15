import * as fs from 'fs';
import { DtoGenerator } from './dto.generator';
import { JsonSchemaParser } from '../json-schema';
describe('Test DTO generator', () => {
  const generator = new DtoGenerator();
  const parser = new JsonSchemaParser();
  const jsonSchema = JSON.parse(fs.readFileSync(`test/fixtures/schemas/monolith/json-schema.json`, 'utf-8'));
  const canonical = parser.parse(jsonSchema);
  it('should generate enum', () => {
    const dtos = generator.generate(canonical);
    console.log(dtos);



  });
});