import { join, Path, strings } from '@angular-devkit/core';
import {
  apply,
  mergeWith,
  move,
  Rule,
  Source,
  template,
  url,
} from '@angular-devkit/schematics';
import { basename, parse } from 'path';
import {
  DEFAULT_SCHEMA_TYPE,
  DEFAULT_SCHEMA_INPUT_DIRECTORY,
  DEFAULT_SCHEMA_OUTPUT_DIRECTORY
} from '../defaults';
import { SchemaOptions } from './schema.schema';
import { ConverterFactory, JsonSchemaToGqlConverter } from '@logosphere/sdk/dist/lib/codegen/converters';
import { SchemaType } from '@logosphere/sdk/dist/lib/codegen';
import { loadJson } from '../../utils';

export function main(options: SchemaOptions): Rule {
  options = transform(options);
  return mergeWith(generate(options, options.outputDirectory));
}

function transform(options: SchemaOptions): SchemaOptions {
  const target: SchemaOptions = Object.assign({}, options);
  target.schemaType = !!target.schemaType ? target.schemaType : DEFAULT_SCHEMA_TYPE;
  target.inputDirectory = !!target.inputDirectory ? target.inputDirectory : DEFAULT_SCHEMA_INPUT_DIRECTORY;

  return target;
}


function generate(options: SchemaOptions, path: string): Source {
  console.log(`Generating ${options.schemaType} schema for ${options.module}`);
  console.log(`Hackolade schema file: ${options.hackoladeSchemaFile}`);
  console.log(`JSON schema file: ${options.jsonSchemaFile}`);

  const jsonSchema = loadJson(options.jsonSchemaFile);
  const converter = ConverterFactory.getConverter(SchemaType.JSON, options.schemaType as SchemaType);
  const targetSchema = converter.convert(jsonSchema.$defs);
  console.log(`GQL: ${targetSchema}`);
  

  return apply(url(join('./files' as Path, options.schemaType)), [
    template({
      ...strings,
      ...options,
    }),
    move(path),
  ]);
}