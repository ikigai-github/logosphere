import { join, Path, strings } from '@angular-devkit/core';
import {
  apply,
  chain,
  filter,
  mergeWith,
  move,
  noop,
  Rule,
  SchematicContext,
  SchematicsException,
  Source,
  template,
  url,
} from '@angular-devkit/schematics';
import { Location, NameParser } from '@nestjs/schematics/dist/utils/name.parser';
import { mergeSourceRoot } from '@nestjs/schematics/dist/utils/source-root.helpers';
import { DEFAULT_LANGUAGE } from '../defaults';
import { DtoOptions } from './dto.schema';

export function main(options: DtoOptions): Rule {
  options = transform(options);
  return chain([mergeSourceRoot(options), mergeWith(generate(options))]);
}

function transform(options: DtoOptions): DtoOptions {
  const target: DtoOptions = Object.assign({}, options);
  if (!target.name) {
    throw new SchematicsException('Option (name) is required.');
  }
  const location: Location = new NameParser().parse(target);

  target.name = strings.dasherize(location.name);
  if (target.name.includes('.')) {
    target.className = strings.classify(target.name).replace('.', '');
  } else {
    target.className = target.name;
  }

  target.language =
    target.language !== undefined ? target.language : DEFAULT_LANGUAGE;

  target.path = strings.dasherize(location.path);
  target.path = target.flat
    ? target.path
    : join(target.path as Path, target.name);

  return target;
}

function generate(options: DtoOptions): Source {
  return (context: SchematicContext) =>
    apply(url(join('./files' as Path, options.language)), [
      options.spec ? noop() : filter(path => !path.endsWith('.spec.ts')),
      template({
        ...strings,
        ...options,
      }),
      move(options.path),
    ])(context);
}