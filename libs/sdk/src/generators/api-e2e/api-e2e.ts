/* eslint-disable no-restricted-imports */
import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  getProjects,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import {
  Definition,
  DefinitionType,
  canonicalSchemaLoader,
} from '@logosphere/converters';
import { strings } from '@angular-devkit/core';
import { DEFAULT_FIXTURE_DEPTH } from '../../common';
import { tsFormatter } from '../utils';
import { ApiE2eGeneratorSchema } from './schema';
import { applicationGenerator } from '../application';
import { initGenerator } from '../init';
import { renameTestTarget } from './utils';

export interface NormalizedSchema extends ApiE2eGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

function normalizeOptions(
  tree: Tree,
  options: ApiE2eGeneratorSchema
): NormalizedSchema {
  const name = names(options.module).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}-e2e`
    : `${name}-e2e`;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).appsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    fixtureDepth: options.fixtureDepth || DEFAULT_FIXTURE_DEPTH,
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

  const templateOptions = {
    ...options,
    ...strings,
    ...tsFormatter,
    ...names(options.projectDirectory),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    npmScope: getWorkspaceLayout(tree).npmScope,
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

export async function apiE2eTestGenerator(
  tree: Tree,
  options: ApiE2eGeneratorSchema
) {
  const normalizedOptions = normalizeOptions(tree, options);
  if (!getProjects(tree).has(normalizedOptions.projectName)) {
    // generate e2e application
    await applicationGenerator(tree, { name: `${options.module}-e2e` });

    // rename "test" target in project.json to "e2e", to avoid e2e tests
    // being picked up during `$ pnx affected:test`
    renameTestTarget(tree, normalizedOptions);
  }

  // install required packages
  await initGenerator(tree, {});

  addFiles(tree, normalizedOptions);

  await formatFiles(tree);
}

export default apiE2eTestGenerator;
