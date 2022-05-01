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

interface NormalizedSchema extends NodeLibraryGeneratorSchema {
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
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  const className = strings.classify(options.name);
  const dashedName = strings.dasherize(options.name);
  const cameledName = strings.camelize(options.name);

  return {
    ...options,
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

export default async function (tree: Tree, options: NodeLibraryGeneratorSchema) {
  options.buildable = true;
  options.compiler = 'tsc';
  options.directory = 'codegen';
  await libraryGenerator(tree, options);
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
