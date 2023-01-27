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

import {
  Definition,
  DefinitionType,
  canonicalSchemaLoader,
} from '../../schema';

import { tsFormatter } from '../utils';
import { DtoGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';
import { strings } from '@angular-devkit/core';

interface NormalizedSchema extends DtoGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: DtoGeneratorSchema
): NormalizedSchema {
  const projectName = `${
    names(options.module).fileName
  }-${DEFAULT_LIB_CODEGEN_PREFIX}`;
  const projectDirectory = projectName;

  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${projectDirectory}/src`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
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
    name: options.module,
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

export async function dtoGenerator(tree: Tree, options: DtoGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default dtoGenerator;
