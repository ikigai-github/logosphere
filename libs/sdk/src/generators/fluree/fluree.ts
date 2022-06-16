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
  FlureeClient,
  flureeDefaults as fd,
  messages,
  FlureeError,
} from '@logosphere/fluree';
import {
  FlureeSchema,
  flureeConstants as fc,
  flureeSchemaLoader,
  flureeSchemaDiff,
  flureeSchemaTransact,
} from '@logosphere/converters';
import { createLedger } from './utils';

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
    source: JSON.stringify(flureeSchemaTransact(newSchema), null, 2),
  };
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
  if (!options.skipLedger) {
    await createLedger(options.module);
    const currentSchema = await flureeSchemaLoader(options.module);
    const diffSchema = flureeSchemaDiff(currentSchema, newSchema);
    console.log('Updating ledger schema');
    const fluree = new FlureeClient({
      url: process.env.FLUREE_URL || fd.FLUREE_URL,
      ledger:
        process.env.FLUREE_LEDGER || `${fd.FLUREE_NETWORK}/${options.module}`,
    });
    const response = await fluree.transactRaw(flureeSchemaTransact(diffSchema));
    if (response.status === 200) {
      console.log('Fluree ledger schema has been updated');
    } else {
      throw new FlureeError(messages.TRANSACT_FAILED);
    }
  }
}

export default flureeGenerator;
