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

import { Definition, DefinitionType } from '../../converters';

import { canonicalSchemaLoader } from '../../schema';
import { UnrealEngineGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';
import { isKeyValueDef, cppFormatter } from './lib';

interface NormalizedSchema extends UnrealEngineGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: UnrealEngineGeneratorSchema
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
  const index = sourceSchema.definitions.filter(
    (def: Definition) => !isKeyValueDef(def)
  );

  const templateOptions = {
    ...options,
    ...strings,
    ...cppFormatter,
    ...names(options.projectDirectory),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
    index,
    definitions: sourceSchema.definitions,
    namePrefix: options.namePrefix ? options.namePrefix : '',
  };

  index.map(async (def: Definition) => {
    const defOptions = {
      ...templateOptions,
      name: names(def.name).className,
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

export async function unrealEngineGenerator(
  tree: Tree,
  options: UnrealEngineGeneratorSchema
) {
  console.log(`Name Prefix: ${options.namePrefix}`);
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
export default unrealEngineGenerator;
