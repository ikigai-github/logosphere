import { Definition, CanonicalSchema } from '../canonical.schema';
import { FederatedSchema } from '../federated.schema';
import { Parser } from '../abstract';
import { ModuleConfiguration } from '../../configuration';
import { FileSystemReader } from '../../readers';
import { JsonSchemaParser } from './json-schema.parser';

export class JsonFederatedSchemaParser extends JsonSchemaParser {
  
  parse(federatedSchemas: FederatedSchema[]): CanonicalSchema {

    const federatedDefs: Definition[] = [];

    federatedSchemas.forEach((federatedSchema: FederatedSchema) => {
      const defs: Definition[] = this.getDefs(federatedSchema.schema);
      defs.map((def: Definition) => {
        federatedDefs.push({ ...def, module: federatedSchema.module });
      });
    });

    return {
      definitions: federatedDefs
    }
  }
}
