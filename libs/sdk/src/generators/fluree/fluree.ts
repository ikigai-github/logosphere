import * as path from 'path';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';

import { ConverterFactory, SchemaType } from '../../converters';

import { canonicalSchemaLoader } from '../../schema';

import { FlureeGeneratorSchema } from './schema';
import { DEFAULT_LIB_CODEGEN_PREFIX } from '../../common';
import {
  FlureeSchema,
  applySchemaDiff,
  schemaTransact,
} from '@logosphere/fluree';

interface NormalizedSchema extends FlureeGeneratorSchema {
  fileName: string;
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
}

function normalizeOptions(
  tree: Tree,
  options: FlureeGeneratorSchema
): NormalizedSchema {
  const fileName = names(options.module).fileName;
  const projectName = `${
    names(options.module).fileName
  }-${DEFAULT_LIB_CODEGEN_PREFIX}`;
  const projectDirectory = projectName;

  const projectRoot = `${
    getWorkspaceLayout(tree).libsDir
  }/${projectDirectory}/src/fluree`;

  return {
    ...options,
    fileName,
    projectName,
    projectRoot,
    projectDirectory,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema) {
  const templateOptions = {
    ...options,
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

  newSchema.collections.push({
    _id: '_collection',
    name: '_user',
    predicates: [
      {
        _id: '_predicate',
        name: 'password',
        type: 'string',
        doc: 'Hashed user password',
      },
      {
        _id: '_predicate',
        name: 'salt',
        type: 'string',
        doc: 'Password salt',
      },
      {
        _id: '_predicate',
        name: 'cardanoPublicKey',
        type: 'string',
        doc: 'User wallet public key on Cardano',
      },
    ],
  });

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
