import { Reader } from '../readers';
import { Configuration } from './configuration';
import { FileSystemReader } from '../readers';
import { LOGOSPHERE_CONFIG_FILE } from './defaults';
import { constants as c} from './configuration.constants';
import { ConfigurationError, messages as m } from './configuration.error';

export class ConfigurationLoader {
  constructor(private readonly reader?: Reader) {}
  public load(name?: string): Configuration {
    const content: string = name
      ? this.reader.read(name)
      : this.reader.read(LOGOSPHERE_CONFIG_FILE);

    if (!content) {
      throw new Error('Error reading configuration file');
    }
    const fileConfig = JSON.parse(content);

    if (!(c.CONFIG in fileConfig) ||
        !(c.MODULES in fileConfig[c.CONFIG])) {
      throw new ConfigurationError(m.INVALID_FORMAT);
    }

    return fileConfig[c.CONFIG];

  }
}

export function loadConfiguration(path?: string): Configuration {
  const configPath = path ? path : process.cwd();
  const loader: ConfigurationLoader = new ConfigurationLoader(
    new FileSystemReader(configPath)
  );
  const configuration = loader.load();
  configuration._configPath = configPath;
  console.log(`Configuration: ${JSON.stringify(configuration)}`)
  return configuration;
}
