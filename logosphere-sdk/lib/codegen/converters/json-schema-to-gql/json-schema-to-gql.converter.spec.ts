//import * as fs from 'fs';
import { JsonSchemaToGqlConverter } from './json-schema-to-gql.converter';
import * as f from '../../../../test/fixtures/schemas/monolith/json-schema.json';
describe('JSON schema to GQL converter test ', () => {
  it('should return GQL schema string', () => {
    const converter = new JsonSchemaToGqlConverter();
    const gqlSchema = converter.convert(f);
    //console.log(canonicalSchema);
    expect(gqlSchema).toBeDefined();
    expect((gqlSchema as string).length > 0).toBeTruthy();
    //console.log(`GQL: ${gqlSchema}`);

    //fs.writeFileSync('./gql.schema.json', gqlSchema);
  });
});
