import { JsonSchemaToGqlFederatedConverter } from './json-schema-to-gql-federated.converter';
import { ConfigurationLoader } from '../../../configuration';
import { FileSystemReader } from '../../../readers';
describe('Test JSON Schema / GQL Federated converter', () => {

  it('should return federated GQL schema', async () => {
    const converter = new JsonSchemaToGqlFederatedConverter();
    const configLoader = new ConfigurationLoader(new FileSystemReader(__dirname));
    const config = await configLoader.load('../../json-schema/logosphere.json');
    const gqlFederated = await converter.convert(config);
    expect(gqlFederated).toBeDefined();
    expect(gqlFederated['user']).toBeDefined();
    expect(gqlFederated['minting']).toBeDefined();
    expect(gqlFederated['auction']).toBeDefined();
  });

});