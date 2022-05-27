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

import {
  Definition,
  canonicalSchemaLoader,
  DefinitionType,
} from '@logosphere/converters';
import { tsFormatter } from '../utils';
import { ResolverGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';

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
  const module = names(options.module).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${module}`
    : module;
  const projectName = options.module;
  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${DEFAULT_CODEGEN_DIR}/${options.module}/src`;
  // update module file
  const moduleFile = path.join(projectRoot, `${options.module}.module.ts`);

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    moduleFile,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const sourceSchema = canonicalSchemaLoader();
  const definitions = sourceSchema.definitions.filter(
    (def: Definition) => def.type === DefinitionType.Entity
  );

  const templateOptions = {
    ...options,
    ...strings,
    ...tsFormatter,
    ...names(options.projectDirectory),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    index: definitions,
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

export default async function (tree: Tree, options: ResolverGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
