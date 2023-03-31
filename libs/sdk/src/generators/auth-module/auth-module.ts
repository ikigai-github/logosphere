/* eslint-disable no-restricted-imports */
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { strings } from '@angular-devkit/core';
import { libraryGenerator } from '@nrwl/node';
import * as path from 'path';
import { NodeLibraryGeneratorSchema } from './schema';
import {
  scopeTag as scope,
  typeTag as type,
  kindTag as kind,
  DEFAULT_CODEGEN_DIR,
  DEFAULT_LIB_CODEGEN_PREFIX,
  DEFAULT_COMPILER,
} from '../../common';

interface NormalizedSchema extends NodeLibraryGeneratorSchema {
  npmScope: string;
  prefix: string;
  fileName: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: NodeLibraryGeneratorSchema
): NormalizedSchema {
  const fileName = names(options.name).fileName;
  const projectName = `${fileName}-${DEFAULT_LIB_CODEGEN_PREFIX}`;
  const projectDirectory = projectName;
  const prefix = DEFAULT_LIB_CODEGEN_PREFIX;
  const workspace = getWorkspaceLayout(tree);
  const npmScope = workspace.npmScope;
  const projectRoot = `${workspace.libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    ...strings,
    fileName,
    prefix,
    npmScope,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    tmpl: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export async function authModuleGenerator(
  tree: Tree,
  options: NodeLibraryGeneratorSchema
) {
  const libName = `${
    names(options.name).fileName
  }-${DEFAULT_LIB_CODEGEN_PREFIX}`;

  const libOptions = {
    name: libName,
    buildable: true,
    compiler: options.compiler || DEFAULT_COMPILER,
    tags: [scope.shared, type.lib, kind.feature].join(','),
    importPath: `@${getWorkspaceLayout(tree).npmScope}/${libName}`,
  };

  await libraryGenerator(tree, libOptions);

  const libsDir = getWorkspaceLayout(tree).libsDir;

  //delete default project.json and package.json
  tree.delete(`${libsDir}/${libName}/package.json`);
  tree.delete(`${libsDir}/${libName}/project.json`);
  //delete default lib files
  tree.delete(`${libsDir}/${libName}/src/lib/${libName}.ts`);
  tree.delete(`${libsDir}/${libName}/src/lib/${libName}.spec.ts`);

  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default authModuleGenerator;
