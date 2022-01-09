import * as fs from 'fs';
import { join, Path, strings } from '@angular-devkit/core';
import {
  apply,
  mergeWith,
  move,
  empty,
  Rule,
  Source,
  template,
  url,
  callRule,
} from '@angular-devkit/schematics';
import { basename, parse } from 'path';
import {
  DEFAULT_SCHEMA_TYPE,
} from '../defaults';
import { SchemaOptions } from './schema.schema';
import { ConverterFactory } from '@logosphere/sdk/dist/lib/codegen/converters';
import { 
  Configuration, 
  loadConfiguration 
} from '@logosphere/sdk/dist/lib/configuration';
import { SchemaType } from '@logosphere/sdk/dist/lib/codegen';



export function main(options: SchemaOptions): Function {
  options = transform(options);
  generate(options);
  return () => { process.exit(0) } ;
}

function transform(options: SchemaOptions): SchemaOptions {
  const target: SchemaOptions = Object.assign({}, options);
  target.schemaType = !!target.schemaType ? target.schemaType : DEFAULT_SCHEMA_TYPE;

  return target;
}


function generate(options: SchemaOptions): void {
  
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
  
}