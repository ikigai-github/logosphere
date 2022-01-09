import * as fs from 'fs';
import { SchemaOptions } from './schema.schema';
import { ConverterFactory } from '@logosphere/sdk/dist/lib/codegen/converters';
import { 
  Configuration, 
  loadConfiguration 
} from '@logosphere/sdk/dist/lib/configuration';
import { SchemaType } from '@logosphere/sdk/dist/lib/codegen';

export function main(options: SchemaOptions): Function {

  const converter = ConverterFactory.getConverter(SchemaType.JsonFederated, options.schemaType as SchemaType);
  const config: Configuration = loadConfiguration();
  const targetSchema = converter.convert(config.modules);
  Object.keys(targetSchema).map((module: string) => {
    const modulePath = `${process.cwd()}/src/${module}`;
    if (!fs.existsSync(modulePath)){
      fs.mkdirSync(modulePath, { recursive: true });
    }
    fs.writeFileSync(`${modulePath}/${module}.schema.gql`, targetSchema[module], {flag: 'w+'});
    console.log(`Generated ${module}/${module}.schema.gql file`);
  });

  return () => { process.exit(0) } ;
}
