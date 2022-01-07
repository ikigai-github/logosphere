import { Reader } from '../readers';
import { Configuration } from './configuration';
import { LOGOSPHERE_CONFIG_FILE } from './defaults';

export class ConfigurationLoader  {
  constructor(private readonly reader: Reader) {}
  public async load(name?: string): Promise<Required<Configuration>> {
    const content: string | undefined = name
      ? await this.reader.read(name)
      : await this.reader.read(LOGOSPHERE_CONFIG_FILE);

    if (!content) {
      throw new Error('Error reading configuration file')
    }
    const fileConfig = JSON.parse(content);
    
    return fileConfig;
  }
}