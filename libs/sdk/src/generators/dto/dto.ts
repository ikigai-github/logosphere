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
  ConverterFactory,
  Definition,
  DefinitionType,
  SchemaType,
  canonicalSchemaLoader,
  tsFormatter,
} from '@logosphere/converters';
import { DtoGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';
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
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = options.module; //projectDirectory.replace(new RegExp('/', 'g'), '-');
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
  const templateOptions = {
    ...options,
    ...strings,
    ...tsFormatter,
    ...names(options.projectDirectory),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default async function (tree: Tree, options: DtoGeneratorSchema) {
  const sourceSchema = canonicalSchemaLoader();

  sourceSchema.definitions
    .filter((def: Definition) => def.type === DefinitionType.Entity)
    .map(async (def: Definition) => {
      options = {
        ...options,
        name: def.name,
        definition: def,
      };
      const normalizedOptions = normalizeOptions(tree, options);
      addFiles(tree, normalizedOptions);
      await formatFiles(tree);
    });
}
