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
} from '@logosphere/converters';
import { tsFormatter } from '../utils';
import { MapperGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';

interface NormalizedSchema extends MapperGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: MapperGeneratorSchema
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
      path.join(__dirname, `files/mappers/${options.type}`),
      `${options.projectRoot}/mappers/${options.type}`,
      defOptions
    );
  });
}

export default async function (tree: Tree, options: MapperGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
