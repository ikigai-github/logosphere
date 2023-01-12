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
  DEFAULT_COMPILER,
} from '../../common';

interface NormalizedSchema extends NodeLibraryGeneratorSchema {
  npmScope: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: NodeLibraryGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${options.directory}/${options.name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const workspace = getWorkspaceLayout(tree);
  const npmScope = workspace.npmScope;
  const projectRoot = `${workspace.libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    ...strings,
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

export async function moduleGenerator(
  tree: Tree,
  options: NodeLibraryGeneratorSchema
) {
  options.buildable = true;
  options.compiler = options.compiler || DEFAULT_COMPILER;
  options.directory = options.directory || DEFAULT_CODEGEN_DIR;
  options.tags = [scope.shared, type.lib, kind.feature].join(',');
  const normalizedOptions = normalizeOptions(tree, options);
  options.importPath = `@${normalizedOptions.npmScope}/${normalizedOptions.projectName}`;
  await libraryGenerator(tree, options);
  //delete default project.json and package.json
  tree.delete(`${options.directory}/${options.name}/package.json`);
  tree.delete(`${options.directory}/${options.name}/project.json`);

  addFiles(tree, normalizedOptions);
  tree.delete(
    `${options.directory}/${options.name}/src/lib/codegen-${options.name}.ts`
  );
  tree.delete(
    `${options.directory}/${options.name}/src/lib/codegen-${options.name}.spec.ts`
  );
  await formatFiles(tree);
}

export default moduleGenerator;
