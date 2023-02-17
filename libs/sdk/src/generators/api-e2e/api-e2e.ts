/* eslint-disable no-restricted-imports */
import {
  formatFiles,
  generateFiles,
  getProjects,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { strings } from '@angular-devkit/core';
import { libraryGenerator } from '@nrwl/node';
import * as path from 'path';
import randomstring from 'randomstring';
import { ApiE2eGeneratorSchema } from './schema';
import {
  scopeTag as scope,
  typeTag as type,
  kindTag as kind,
  DEFAULT_LIB_CODEGEN_PREFIX,
  DEFAULT_COMPILER,
  DEFAULT_FIXTURE_DEPTH,
} from '../../common';
import {
  Definition,
  DefinitionType,
  canonicalSchemaLoader,
} from '../../schema';
import { tsFormatter, gqlFormatter } from '../utils';
import { renameTestTarget } from './utils';

export interface NormalizedSchema extends ApiE2eGeneratorSchema {
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
  options: ApiE2eGeneratorSchema
): NormalizedSchema {
  const fileName = names(options.module).fileName;
  const projectName = `${fileName}-e2e`;
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
  const sourceSchema = canonicalSchemaLoader(options.module);
  const definitions = sourceSchema.definitions.filter(
    (def: Definition) => def.type === DefinitionType.Entity
  );

  const applications = [...getProjects(tree).entries()]
    .filter(
      ([key, value]) =>
        !key.includes('e2e') && value.projectType === 'application'
    )
    .map(([key, value], index) => ({
      name: key,
      port: 4000 + index,
      path: value.root,
    }));

  const templateOptions = {
    ...options,
    ...names(options.module),
    ...tsFormatter,
    ...gqlFormatter,
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    fixtureDepth: options.fixtureDepth || DEFAULT_FIXTURE_DEPTH,
    tmpl: '',
    dot: '.',
    applications,
    password: randomstring.generate(50),
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

export async function apiE2eTestGenerator(
  tree: Tree,
  options: ApiE2eGeneratorSchema
) {
  const libName = `${names(options.module).fileName}-e2e`;
  const libOptions = {
    name: libName,
    buildable: false,
    publishable: false,
    compiler: options.compiler || DEFAULT_COMPILER,
    tags: [scope.shared, type.lib, kind.feature].join(','),
  };

  const normalizedOptions = normalizeOptions(tree, options);

  if (!getProjects(tree).has(`${options.module}-e2e`)) {
    await libraryGenerator(tree, libOptions);
    renameTestTarget(tree, normalizedOptions);
  }

  const libsDir = getWorkspaceLayout(tree).libsDir;

  //delete default lib files
  tree.delete(`${libsDir}/${libName}/src/lib/${libName}.ts`);
  tree.delete(`${libsDir}/${libName}/src/lib/${libName}.spec.ts`);

  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

export default apiE2eTestGenerator;
