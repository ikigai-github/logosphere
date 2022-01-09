import * as fs from 'fs';
import { GqlGenerator } from './gql.generator';
import { JsonSchemaFederatedParser } from '../json-schema';
import { CanonicalSchema } from '../canonical.schema';
describe('Test GQL generator', () => {
  it('should generate valid GQL', () => {
    const generator = new GqlGenerator();
    const canonical = JSON.parse(fs.readFileSync(`${__dirname}/../../../test/fixtures/schemas/federated/canonical/canonical-schema.json`, 'utf-8')) as CanonicalSchema;
    const gql = generator.generate(canonical);
    console.log(gql);
  });
});