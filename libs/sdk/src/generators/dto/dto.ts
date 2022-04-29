import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { FileSystemReader } from '@logosphere/readers';
import { } from '@logosphere/converters';
import { DtoGeneratorSchema } from './schema';

interface NormalizedSchema extends DtoGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
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

/*
const module = await selectModule(config);

      const reader = new FileSystemReader(process.cwd());
      const sourceSchema = config.model === 'schema-first' 
          ? JSON.parse(reader.read(module.jsonSchemaFile))
          : canonicalSchemaLoader()
      
      const converter = config.model === 'schema-first' 
        ? ConverterFactory.getConverter(
            SchemaType.Json,
            SchemaType.Dto,
          )
        : ConverterFactory.getConverter(
          SchemaType.Canonical,
          SchemaType.Dto,
        )
      const dtos: DtoSchema[] = converter.convert(sourceSchema);

      dtos.map(async (dto: DtoSchema) => {
        const schematicOptions = buildSchematicOptions(inputs, nestConfig);
        schematicOptions.push(new SchematicOption('module', module.name));
        schematicOptions.push(
          new SchematicOption('name', `${module.name}/dto/${dto.name}`),
        );
        schematicOptions.push(new SchematicOption('content', dto.schema));
        await collection.execute(
          schematicInput.value as string,
          schematicOptions,
        );
      });
*/

export default async function (tree: Tree, options: DtoGeneratorSchema) {
  const normalizedOptions = normalizeOptions(tree, options);
  const reader = new FileSystemReader(process.cwd());
  const sourceSchema = canonicalSchemaLoader();
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}
