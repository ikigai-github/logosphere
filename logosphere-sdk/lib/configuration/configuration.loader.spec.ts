import { ConfigurationLoader } from './configuration.loader';
import { FileSystemReader } from '../readers';
import { Configuration, loadConfiguration } from './configuration';

describe('Test configuration loader', () => {
  const configPath = '../../test/fixtures/logosphere.json';

  it('should load configuration from the file system', async () => {
    const configLoader = new ConfigurationLoader(
      new FileSystemReader(__dirname)
    );
    const config: Configuration = configLoader.load(configPath);
    expect(config).toBeDefined();
    expect(config.modules).toBeDefined();
    expect(config.modules).toHaveLength(3);
    expect(config._configPath).toBe(configPath);
  });
});
