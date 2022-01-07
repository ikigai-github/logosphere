import { DefinitionType } from '..';
import { IDefinition } from '../canonical.schema';
import { Parser } from '../parser.abstract';
import { Configuration, ModuleConfiguration } from '../../configuration';
import { } from '../../readers';


export class JsonSchemaFederatedParser extends Parser {
  protected async getDefs(config: Configuration): Promise<IDefinition[]> {
    config.modules.forEach((module: ModuleConfiguration) => {
      


    });
    return [{name: '', type: DefinitionType.Enum, props: []}]
  }

}