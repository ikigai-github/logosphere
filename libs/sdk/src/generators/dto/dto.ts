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
  DtoSchema,
  SchemaType, 
  canonicalSchemaLoader 
} from '@logosphere/converters';
import { DtoGeneratorSchema } from './schema';

interface NormalizedSchema extends DtoGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  content?: string;
  parsedTags: string[]
}

function normalizeOptions(tree: Tree, options: DtoGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
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
      template: ''
    };
    generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export default async function (tree: Tree, options: DtoGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const sourceSchema = canonicalSchemaLoader();
  const converter =  ConverterFactory.getConverter(
          SchemaType.Canonical,
          SchemaType.Dto,
        )
  const dtos: DtoSchema[] = converter.convert(sourceSchema);
  dtos.map(async (dto: DtoSchema) => {
    const contentOptions: NormalizedSchema = {
      ...normalizedOptions,
      name: dto.name,
      content: dto.schema
    }
    addFiles(tree, contentOptions);
    await formatFiles(tree);
  });
}
