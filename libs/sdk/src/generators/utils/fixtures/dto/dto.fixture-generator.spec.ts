import { dtoData } from './dto.fixture-generator';
import * as schema from '../../art-marketplace.canonical.schema.json';
import { CanonicalSchema } from '@logosphere/ddd';
import { predicates as p } from './dto.fixture-generator.constants';

describe('Dto Fixture Generator', () => {
  const s = schema as CanonicalSchema;
  it('should create Dto fixture', () => {
    const data = dtoData(s.definitions, 'artwork', false, 1);
    expect(data).toBeDefined();
    expect(p.SUBJECT_ID in data).toBeTruthy();
    expect(p.ID in data).toBeTruthy();
    expect(p.CREATED_AT in data).toBeTruthy();
  });
});
