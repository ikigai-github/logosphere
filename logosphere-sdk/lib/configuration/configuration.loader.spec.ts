import { ConfigurationLoader } from './configuration.loader';
import { FileSystemReader } from '../readers';
import { Configuration } from './configuration';

describe('Test configuration loader', () => {
  it('should load configuration from the file system', async () => {
    const configLoader = new ConfigurationLoader(
      new FileSystemReader(__dirname)
    );
    const config: Configuration = configLoader.load(
      '../../test/fixtures/logosphere.json'
    );
    expect(config).toBeDefined();
    expect(config.modules).toBeDefined();
    expect(config.modules).toHaveLength(3);
  });
});
