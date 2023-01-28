/* eslint-disable no-restricted-imports */
import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';

import { strings } from '@angular-devkit/core';
import { applyTransform } from 'jscodeshift/src/testUtils';

import { Definition, DefinitionType } from '../../schema';

import { canonicalSchemaLoader } from '../../schema';

import { tsFormatter } from '../utils';
import { ResolverGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

import { addImport, addProviderToModule } from '../utils/transforms';

interface NormalizedSchema extends ResolverGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  moduleFile: string;
}

function normalizeOptions(
  tree: Tree,
  options: ResolverGeneratorSchema
): NormalizedSchema {
  const projectName = `${
    names(options.module).fileName
  }-${DEFAULT_LIB_CODEGEN_PREFIX}`;
  const projectDirectory = projectName;
  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${projectDirectory}/src`;
  const moduleFile = path.join(
    projectRoot,
    `${names(options.module).fileName}.module.ts`
  );
  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    moduleFile,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const sourceSchema = canonicalSchemaLoader(options.module);
  const definitions = options.definition
    ? [options.definition]
    : sourceSchema.definitions.filter(
        (def: Definition) => def.type === DefinitionType.Entity
      );

  const templateOptions = {
    ...options,
    ...strings,
    ...tsFormatter,
    ...names(options.projectDirectory),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    index: options.index ? options.index : definitions,
  };

  definitions.map(async (def: Definition) => {
    const defOptions = {
      ...templateOptions,
      name: names(def.name).fileName,
      definition: def,
    };

    generateFiles(
      tree,
      path.join(__dirname, 'files'),
      options.projectRoot,
      defOptions
    );

    // update module
    const input = tree.read(options.moduleFile).toString();
    const transformOptions = {
      module: options.module,
      name: strings.classify(`${def.name}Resolver`),
      importFile: './resolvers',
    };
    let output = applyTransform(
      { default: addImport, parser: 'ts' },
      transformOptions,
      { source: input, path: options.moduleFile }
    );

    output = applyTransform(
      { default: addProviderToModule, parser: 'ts' },
      transformOptions,
      { source: output, path: options.moduleFile }
    );

    tree.write(options.moduleFile, output, {});
  });
}

export async function resolverGenerator(
  tree: Tree,
  options: ResolverGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default resolverGenerator;
