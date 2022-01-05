//import * as fs from 'fs';
import { JsonSchemaToGqlConverter } from './json-schema-to-gql.converter';
import * as f from '../../json-schema/json-schema.fixture.json';
describe('JSON schema to canonical format converter test ', () => {
  it('should return canonical schema string', () => {
    const converter = new JsonSchemaToGqlConverter();
    const gqlSchema = converter.convert(f);
    //console.log(canonicalSchema);
    expect(gqlSchema).toBeDefined();
    expect((gqlSchema as string).length > 0).toBeTruthy();
    console.log(`GQL: ${gqlSchema}`);

    //fs.writeFileSync('./gql.schema.json', gqlSchema);
  });
});
