import { ConfigurationLoader } from './configuration.loader';
import { FileSystemReader } from '../readers';
import { Configuration } from './configuration';
import { constants as c } from './configuration.constants';

describe('Test configuration loader', () => {
  it('should load schema-first configuration from the file system', async () => {
    const configLoader = new ConfigurationLoader(
      new FileSystemReader(__dirname)
    );
    const config: Configuration = configLoader.load(
      '../../test/fixtures/logosphere-schema-first.json'
    );
    expect(config).toBeDefined();
    expect(config.model).toBeDefined();
    expect(config.model).toEqual(c.SCHEMA_FIRST);
    expect(config.modules).toBeDefined();
    expect(config.modules).toHaveLength(3);
  });

  it('should load code-first configuration from the file system', async () => {
    const configLoader = new ConfigurationLoader(
      new FileSystemReader(__dirname)
    );
    const config: Configuration = configLoader.load(
      '../../test/fixtures/logosphere-code-first.json'
    );
    expect(config).toBeDefined();
    expect(config.model).toBeDefined();
    expect(config.model).toEqual(c.CODE_FIRST);
  });
});
