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
import { truncate } from 'lodash';

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

  // newSchema.collections.push({
  //   _id: '_collection',
  //   name: 'walletAsset',
  //   predicates: [
  //     {
  //       _id: '_predicate',
  //       name: 'name',
  //       type: 'string',
  //       doc: 'Name of the asset',
  //     },
  //     {
  //       _id: '_predicate',
  //       name: 'policyId',
  //       type: 'string',
  //       doc: 'Policy of the asset',
  //     },
  //     {
  //       _id: '_predicate',
  //       name: 'quantity',
  //       type: 'int',
  //       doc: 'Quantity of the asset',
  //     },
  //     {
  //       _id: '_predicate',
  //       name: 'metadata',
  //       type: 'json',
  //       doc: 'Metadata of the asset',
  //     },
  //     {
  //       _id: '_predicate',
  //       name: 'subjectId',
  //       type: 'int',
  //       doc: 'Fluree subject ID associated with the asset',
  //     },
  //   ],
  // });

  // newSchema.collections.push({
  //   _id: '_collection',
  //   name: 'wallet',
  //   predicates: [
  //     {
  //       _id: '_predicate',
  //       name: 'walletId',
  //       type: 'string',
  //       index: true,
  //       unique: true,
  //       doc: 'ID of the wallet',
  //     },
  //     {
  //       _id: '_predicate',
  //       name: 'address',
  //       type: 'string',
  //       index: true,
  //       unique: true,
  //       doc: 'Address of the wallet',
  //     },
  //     {
  //       _id: '_predicate',
  //       name: 'publicKey',
  //       type: 'string',
  //       index: true,
  //       unique: true,
  //       doc: 'Public key of the wallet',
  //     },
  //     {
  //       _id: '_predicate',
  //       name: 'assets',
  //       type: 'ref',
  //       restrictCollection: 'walletAsset',
  //       multi: true,
  //       doc: 'Wallet assets',
  //     },
  //   ],
  // });

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
      // {
      //   _id: '_predicate',
      //   name: 'wallet',
      //   type: 'ref',
      //   restrictCollection: 'wallet',
      //   doc: 'User wallet on Cardano',
      // },
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
