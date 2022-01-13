import { Reader } from '../readers';
import { Configuration } from './configuration';
import { FileSystemReader } from '../readers';
import { LOGOSPHERE_CONFIG_FILE } from './defaults';

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

    // process defaults
    

    return fileConfig;
  }
}

export function loadConfiguration(path?: string): Configuration {
  const loader: ConfigurationLoader = new ConfigurationLoader(
    new FileSystemReader(path ? path : process.cwd())
  );
  return loader.load();
}
