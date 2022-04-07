import { FileSystemReader } from '../../readers';
import { JsonFederatedSchema } from './json-federated.schema';
import {
  Configuration,
  ModuleConfiguration,
  ConfigurationLoader,
  LOGOSPHERE_CONFIG_FILE,
} from '../../configuration';
import { TYPE, OBJECT, STRING, ENUM } from '../../common/const';

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
    const modelSchema = schema.$defs;

    Object.keys(schema.properties)
      .filter((key) => schema.properties[key][TYPE] === OBJECT)
      .forEach((property) => {
        try {
          Object.assign(modelSchema, {
            [property]: schema.properties[property],
          });
        } catch (error) {}
      });

    //add unreferenced enums
    Object.keys(schema.properties)
      .filter(
        (key) =>
          schema.properties[key][TYPE] === STRING &&
          ENUM in schema.properties[key]
      )
      .forEach((property) => {
        try {
          Object.assign(modelSchema, {
            [property]: schema.properties[property],
          });
        } catch (error) {}
      });

    Object.freeze(modelSchema);
    federatedSchemas.push({ module: module.name, schema: modelSchema });
  });

  return federatedSchemas;
};
