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

import {
  Definition,
  DefinitionType,
  canonicalSchemaLoader,
  tsFormatter,
} from '@logosphere/converters';
import { RepositoryGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';

interface NormalizedSchema extends RepositoryGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: RepositoryGeneratorSchema
): NormalizedSchema {
  const module = names(options.module).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${module}`
    : module;
  const projectName = options.module;
  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${DEFAULT_CODEGEN_DIR}/${options.module}/src`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
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
  });
}

export default async function (tree: Tree, options: RepositoryGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
