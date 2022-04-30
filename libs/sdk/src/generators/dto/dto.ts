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
}

function normalizeOptions(tree: Tree, options: DtoGeneratorSchema): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : `dto/${name}`;
  const projectName = options.module; //projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${options.module}`;
  

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
    const templateOptions = {
      ...options,
      ...names(options.projectDirectory),
      offsetFromRoot: offsetFromRoot(options.projectRoot),
      template: ''
    };
    generateFiles(tree, path.join(__dirname, 'files'), options.projectRoot, templateOptions);
}

export default async function (tree: Tree, options: DtoGeneratorSchema) {
  const sourceSchema = canonicalSchemaLoader();
  const converter =  ConverterFactory.getConverter(
          SchemaType.Canonical,
          SchemaType.Dto,
        )
  const dtos: DtoSchema[] = converter.convert(sourceSchema);
  dtos.map(async (dto: DtoSchema) => {
   
    options = {
      ...options,
      name: dto.name,
      source: dto.schema
    }
    const normalizedOptions = normalizeOptions(tree, options);
    addFiles(tree, normalizedOptions);
    await formatFiles(tree);
  });
}
