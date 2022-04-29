import { FileSystemReader } from '@logosphere/readers';
import { JsonFederatedSchema } from './json-federated.schema';
import {
  Configuration,
  ModuleConfiguration,
  ConfigurationLoader,
  LOGOSPHERE_CONFIG_FILE,
} from '@logosphere/configuration';

export const jsonFederatedSchemaLoader = (
  configFileDir?: string
): JsonFederatedSchema[] => {
  const federatedSchemas: JsonFederatedSchema[] = [];
  const dir = configFileDir ? configFileDir : process.cwd();
  const reader = new FileSystemReader(dir);
  const configLoader = new ConfigurationLoader(new FileSystemReader(dir));
  const config: Configuration = configLoader.load(LOGOSPHERE_CONFIG_FILE);

  config.modules.map((module: ModuleConfiguration) => {
    const schema = JSON.parse(reader.read(module.jsonSchemaFile));
    federatedSchemas.push({ module: module.name, schema });
  });

  return federatedSchemas;
};
