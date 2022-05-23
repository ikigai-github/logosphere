import { flureeData } from './fluree.fixture-generator';
import * as schema from '../../../../../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json';
import { CanonicalSchema } from '@logosphere/converters';
import { predicates as p } from './fluree.fixture-generator.constants';

describe('Fluree Fixture Generator', () => {
  const s = schema as CanonicalSchema;
  it('should create Fluree fixture', () => {
    const data = flureeData(s.definitions, 'artwork', true, false, 1);
    expect(data).toBeDefined();
    expect(p.SUBJECT_ID in data).toBeTruthy();
    expect(`artwork/${p.IDENTIFIER}` in data).toBeTruthy();
    expect(`artwork/${p.CREATED_AT}` in data).toBeTruthy();
  });
});
