import { JsonSchemaToGqlFederatedConverter } from './json-schema-to-gql-federated.converter';
import { ConfigurationLoader } from '../../../configuration';
import { FileSystemReader } from '../../../readers';
describe('Test JSON Schema / GQL Federated converter', () => {

  it('should return federated GQL schema', () => {
    const converter = new JsonSchemaToGqlFederatedConverter();
    const configLoader = new ConfigurationLoader(new FileSystemReader(`${__dirname}/../../../../test/fixtures`));
    const config = configLoader.load();
    const gqlFederated = converter.convert(config);
    expect(gqlFederated).toBeDefined();
    expect(gqlFederated['user']).toBeDefined();
    expect(gqlFederated['minting']).toBeDefined();
    expect(gqlFederated['auction']).toBeDefined();
  });

});