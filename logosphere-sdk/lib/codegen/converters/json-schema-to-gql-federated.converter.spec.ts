import { FileSystemReader } from '../../readers';
import { JsonSchemaToGqlFederatedConverter } from '../converters';
import { JsonSchemaFederatedParser } from '../json-schema';
import { GqlGenerator } from '../gql';
import { Configuration, ConfigurationLoader } from '../../configuration';

describe('Converters', () => {
  test('JSON Schema to GQL Federated ', () => {
    const converter = new JsonSchemaToGqlFederatedConverter(
      new JsonSchemaFederatedParser(), 
      new GqlGenerator()
    );
    const configLoader = new ConfigurationLoader(
      new FileSystemReader(`${__dirname}/../../../test/fixtures`)
    );
    const config: Configuration = configLoader.load();
    const gqlFederated = converter.convert(config.modules);
    expect(gqlFederated).toBeDefined();
    expect(gqlFederated['user']).toBeDefined();
    expect(gqlFederated['minting']).toBeDefined();
    expect(gqlFederated['auction']).toBeDefined();
  });
});