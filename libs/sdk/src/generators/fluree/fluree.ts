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
  SchemaType,
  canonicalSchemaLoader,
} from '@logosphere/converters';
import { FlureeGeneratorSchema } from './schema';
import { DEFAULT_CODEGEN_DIR } from '../../common';
import {
  FlureeSchema,
  applySchemaDiff,
  schemaTransact,
} from '@logosphere/fluree';

interface NormalizedSchema extends FlureeGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: FlureeGeneratorSchema
): NormalizedSchema {
  const name = names(options.module).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : `fluree/${name}`;
  const projectName = options.module; //projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${DEFAULT_CODEGEN_DIR}/${options.module}/src`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
    ...names(options.projectDirectory),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export async function flureeGenerator(
  tree: Tree,
  options: FlureeGeneratorSchema
) {
  const canonicalSchema = canonicalSchemaLoader(options.module);
  const converter = ConverterFactory.getConverter(
    SchemaType.Canonical,
    SchemaType.Fluree
  );
  const newSchema: FlureeSchema = converter.convert(canonicalSchema);
  options = {
    ...options,
    schemaSource: JSON.stringify(newSchema, null, 2),
    schemaTransactSource: JSON.stringify(schemaTransact(newSchema), null, 2),
  };
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
  if (options.flureeLedger) {
    const ledger = process.env.FLUREE_LEDGER || `local/${options.module}`;
    await applySchemaDiff(ledger, newSchema);
  }
}

export default flureeGenerator;
