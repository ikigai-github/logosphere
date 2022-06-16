import * as fs from 'fs';
import { FlureeGenerator } from './fluree.generator';
import { JsonSchemaParser } from '../json-schema';

describe('Fluree Generator', () => {
  it('should generate Fluree collections schema', () => {
    const canonicalSchema = JSON.parse(
      fs.readFileSync(
        `${__dirname}/../../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json`,
        'utf-8'
      )
    );
    const generator = new FlureeGenerator();
    const flureeSchema = generator.generate(canonicalSchema);
    const expectedSchema = JSON.parse(
      fs.readFileSync(
        `${__dirname}/../../../test/fixtures/code-first/schemas/monolith/fluree/art-marketplace.fluree.schema.json`,
        'utf-8'
      )
    );
    expect(flureeSchema).toBeDefined();
    expect(flureeSchema).toStrictEqual(expectedSchema);
  });
});
