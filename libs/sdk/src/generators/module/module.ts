import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/node';
import { strings } from '@angular-devkit/core/src';
import * as path from 'path';
import { NodeLibraryGeneratorSchema } from './schema';
import { 
  ModuleBoundaryTag, 
  DEFAULT_CODEGEN_DIR,
  DEFAULT_COMPILER
} from '../../common';

interface NormalizedSchema extends NodeLibraryGeneratorSchema {
  npmScope: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
  className: string;
  cameledName: string;
  dashedName: string;
}

function normalizeOptions(tree: Tree, options: NodeLibraryGeneratorSchema): NormalizedSchema {
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

  const className = strings.classify(options.name);
  const dashedName = strings.dasherize(options.name);
  const cameledName = strings.camelize(options.name);

  return {
    ...options,
    npmScope,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
    className,
    dashedName,
    cameledName
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
    const templateOptions = {
      ...options,
      ...names(options.name),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: ''
    };
    generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export async function moduleGenerator (tree: Tree, options: NodeLibraryGeneratorSchema) {
  options.buildable = true;
  options.compiler = DEFAULT_COMPILER;
  options.directory = DEFAULT_CODEGEN_DIR;
  options.tags = ModuleBoundaryTag.Shared;
  const normalizedOptions = normalizeOptions(tree, options);
  options.importPath = `@${normalizedOptions.npmScope}/${normalizedOptions.projectName}`;
  await libraryGenerator(tree, options);
 
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default moduleGenerator;
