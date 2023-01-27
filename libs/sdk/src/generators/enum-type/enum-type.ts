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
} from '../../schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';

import { tsFormatter } from '../utils';
import { EnumTypeGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';

interface NormalizedSchema extends EnumTypeGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: EnumTypeGeneratorSchema
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
        (def: Definition) => def.type === DefinitionType.Enum
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

export async function enumTypeGenerator(
  tree: Tree,
  options: EnumTypeGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
export default enumTypeGenerator;
