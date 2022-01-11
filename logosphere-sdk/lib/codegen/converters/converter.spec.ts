import * as fs from 'fs';
import { Converter } from './converter';
import { JsonSchemaParser } from '../json-schema';
import { GqlGenerator } from '../gql/gql.generator';

import * as f from '../../../test/fixtures/schemas/monolith/json-schema.json';
describe('Converters', () => {

  test('JSON Schema to GQL', () => {
    const converter = new Converter(new JsonSchemaParser(), new GqlGenerator());
    const gqlSchema = converter.convert(f);
    //console.log(canonicalSchema);
    expect(gqlSchema).toBeDefined();
    expect((gqlSchema as string).length > 0).toBe(true);
    //console.log(`GQL: ${gqlSchema}`);

    //fs.writeFileSync('./gql.schema.json', gqlSchema);
  });

});
