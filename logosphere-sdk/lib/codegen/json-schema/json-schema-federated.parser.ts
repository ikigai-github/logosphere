import * as fs from 'fs';
import { DefinitionType } from '..';
import { IDefinition } from '../canonical.schema';
import { Parser } from '../parser.abstract';


export class JsonSchemaFederatedParser extends Parser {
  protected getDefs(configFilePath: any): IDefinition[] {
    const config = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));
    config.modules

    return [{name: '', type: DefinitionType.Enum, props: []}]
  }

}