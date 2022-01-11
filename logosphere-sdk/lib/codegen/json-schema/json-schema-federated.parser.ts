import { Definition } from '../canonical.schema';
import { Parser } from '../abstract/parser.abstract';
import { ModuleConfiguration } from '../../configuration';
import { FileSystemReader } from '../../readers';
import { JsonSchemaParser } from './json-schema.parser';

export class JsonSchemaFederatedParser extends Parser {
  protected getDefs(modules: ModuleConfiguration[]): Definition[] {
    const reader = new FileSystemReader(process.cwd());
    const parser = new JsonSchemaParser();
    const defs: Definition[] = [];

    modules.map((module: ModuleConfiguration) => {
      const schema = JSON.parse(reader.read(module.jsonSchemaFile));
      const canonical = parser.parse(schema);
      const federatedDefs = canonical.definitions.map((def: Definition) => {
        return { ...def, module: module.name };
      });
      defs.push(...federatedDefs);
    });

    return defs;
  }
}
