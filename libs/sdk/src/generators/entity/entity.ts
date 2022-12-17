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

import { Definition, DefinitionType } from '@logosphere/schema';

import { canonicalSchemaLoader } from '@logosphere/model';

import { tsFormatter } from '../utils';
import { EntityGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';

interface NormalizedSchema extends EntityGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: EntityGeneratorSchema
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
  const sourceSchema = canonicalSchemaLoader(options.module);
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

export async function entityGenerator(
  tree: Tree,
  options: EntityGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default entityGenerator;
