import { join, Path, strings } from '@angular-devkit/core';
import { 
  apply,
  branchAndMerge,
  chain,
  filter,
  MergeStrategy,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Source,
  template,
  Tree,
  url, } from '@angular-devkit/schematics';
import { Location, NameParser } from '@nestjs/schematics/dist/utils/name.parser';
import { mergeSourceRoot } from '@nestjs/schematics/dist/utils/source-root.helpers';
import { SchemaOptions } from './schema.schema';
import { ConverterFactory } from '@logosphere/sdk/dist/lib/codegen/converters';
import { 
  Configuration, 
  loadConfiguration 
} from '@logosphere/sdk/dist/lib/configuration';
import { SchemaType } from '@logosphere/sdk/dist/lib/codegen';

export function main(options: SchemaOptions): Rule  {
  options = transform(options);
  return (tree: Tree, context: SchematicContext) => {
    return branchAndMerge(
      chain([
        mergeSourceRoot(options),
        mergeWith(generate(options), MergeStrategy.Overwrite),
      ]),
    )(tree, context);
  };
}

function transform(source: SchemaOptions): SchemaOptions {
  const target: SchemaOptions = Object.assign({}, source);
  target.type = 'schema';
  if (!target.module) {
    throw new SchematicsException('Option module is required.');
  }
  target.name = target.module;
  const location: Location = new NameParser().parse(target);
  target.name = strings.dasherize(location.name);
  target.path = strings.dasherize(location.path);
  target.schemaType = target.schemaType !== undefined ? target.schemaType : 'gql';

  target.path = target.flat
    ? target.path
    : join(target.path as Path, target.name);
  return target;
}

function generate(options: SchemaOptions): Source {
  
  return (context: SchematicContext) =>
    apply(url(join('./files' as Path, options.schemaType)), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}
