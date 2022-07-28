import { gqlQuery } from './gql.query-generator';
import * as schema from '../../../../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json';
import { CanonicalSchema } from '@logosphere/converters';
import { system as s } from './gql.query-generator.constants';

describe('GQL query Generator', () => {
  const s = schema as CanonicalSchema;
  it('should create GQL query', () => {
    const query = gqlQuery(s.definitions, 'artwork', 2);
    expect(query).toBeDefined();
    console.log(`Generated GQL query: ${query}`);
  });
});
