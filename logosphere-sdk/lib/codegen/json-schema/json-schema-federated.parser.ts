import { Definition } from '../canonical.schema';
import { Parser } from '../parser.abstract';
import { Configuration, ModuleConfiguration } from '../../configuration';
import { FileSystemReader } from '../../readers';
import { JsonSchemaParser } from './json-schema.parser';


export class JsonSchemaFederatedParser extends Parser {
  protected async getDefs(config: Configuration): Promise<Definition[]> {
    const reader = new FileSystemReader(__dirname);
    const parser = new JsonSchemaParser();
    const defs: Definition[] = [];
    await Promise.all(
      config.modules.map(async (module: ModuleConfiguration) => {
        const schema = JSON.parse(await reader.read(module.jsonSchemaFile));
        const canonical = await parser.parse(schema);
        const federatedDefs = canonical.definitions.map(
          (def: Definition) => {return { ...def, module: module.name } }
        );
        defs.push(...federatedDefs);
      })
    );
    return defs;
  }

  

}