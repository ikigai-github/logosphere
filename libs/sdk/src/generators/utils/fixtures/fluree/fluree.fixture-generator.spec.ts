import { flureeData } from './fluree.fixture-generator';
import * as schema from '../../../../../../test/fixtures/code-first/schemas/monolith/canonical/art-marketplace.canonical.schema.json';
import { CanonicalSchema } from '@logosphere/converters';

describe('Fixture Generator', () => {
  const s = schema as CanonicalSchema;
  it('should create Fluree fixture', () => {
    const data = flureeData(s.definitions, 'artwork', true, false, 1);
    console.log(JSON.stringify(data));
    expect(data).toBeDefined();
  });
});
