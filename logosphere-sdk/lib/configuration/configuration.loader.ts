import { Reader } from '../readers';
import { Configuration, ModuleConfiguration } from './configuration';
import { FileSystemReader } from '../readers';
import { LOGOSPHERE_CONFIG_FILE } from './defaults';
import { constants as c } from './configuration.constants';
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

    if (
      !(c.CONFIG in fileConfig) ||
      !(c.MODEL in fileConfig[c.CONFIG]) ||
      (fileConfig[c.CONFIG][c.MODEL] === c.SCHEMA_FIRST &&
        !(c.MODULES in fileConfig[c.CONFIG]))
    ) {
      throw new ConfigurationError(m.INVALID_FORMAT);
    }

    return fileConfig[c.CONFIG];
  }

  public loadModuleConfig(moduleName: string, path?: string): ModuleConfiguration {
    const moduleConfigFile = path ? path : 'src/' + `${moduleName}/${moduleName}${c.MODULE_CONFIG_FILE_EXT}`;
    const content: string =  this.reader.read(moduleConfigFile);

    if (!content) {
      throw new Error('Error reading configuration file');
    }
    const fileConfig = JSON.parse(content);
    if (
      !(c.CONFIG in fileConfig) &&
      !(c.NAME in fileConfig[c.CONFIG])
    ) {
      throw new ConfigurationError(m.INVALID_FORMAT);
    }

    if (fileConfig[c.CONFIG][c.NAME] !== moduleName) {
      throw new ConfigurationError(m.INCORRECT_MODULE_NAME)
    }
    return fileConfig[c.CONFIG]
  }
}



export function loadConfiguration(path?: string): Configuration {
  const loader: ConfigurationLoader = new ConfigurationLoader(
    new FileSystemReader(path ? path : process.cwd())
  );
  return loader.load();
}

export function loadModuleConfiguration(moduleName, path?: string): ModuleConfiguration {
  const loader: ConfigurationLoader = new ConfigurationLoader(
    new FileSystemReader(path ? path : process.cwd())
  );
  return loader.loadModuleConfig(moduleName, path);
}
