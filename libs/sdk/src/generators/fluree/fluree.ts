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
  FlureeError,
  compile,
  select,
  messages,
  flattenNames,
} from '@logosphere/fluree';
import {
  FlureeSchema,
  FlureeCollection,
  FlureePredicate,
  FlureeSchemaParser,
  CanonicalSchemaGenerator,
  Converter,
  flureeConstants as fc,
} from '@logosphere/converters';

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
  const sourceSchema = canonicalSchemaLoader(options.module);
  const converter = ConverterFactory.getConverter(
    SchemaType.Canonical,
    SchemaType.Fluree
  );
  const source = converter.convert(sourceSchema);
  options = {
    ...options,
    source,
  };
  const normalizedOptions = normalizeOptions(tree, options);
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);

  const ledger = process.env.FLUREE_LEDGER || `local/${options.module}`;
  const fluree = new FlureeClient({
    url: process.env.FLUREE_URL || 'http://localhost:8090',
    ledger,
  });
  const ledgers = await fluree.listLedgers();
  if (!ledgers.find((l: string) => l === ledger)) {
    console.log(`Creating Fluree ${ledger} ledger for the module`);
    const response = await fluree.createLedger(ledger);
    if (response.status !== 200) {
      throw new FlureeError(messages.CREATE_LEDGER_FAILED);
    } else {
      console.log(`Ledger ${ledger} created`);
    }
  }

  const collectionSpec = compile(select().from('_collection').build());
  const collections = await fluree.query(collectionSpec);

  const predicateSpec = compile(select().from('_predicate').build());
  const predicates = await fluree.query(predicateSpec);
  const colNameKey = `${fc.COLLECTION}/${fc.NAME}`;
  const predNameKey = `${fc.PREDICATE}/${fc.NAME}`;

  const existingFlureeSchema: FlureeSchema = {
    definitions: [
      ...collections
        //filter out system collections, starting with _
        .filter((collection) => collection[colNameKey][0] !== '_')
        .map((collection) => {
          return {
            ...flattenNames(collection),
            predicates: predicates
              .filter(
                (predicate) =>
                  predicate[predNameKey].split('/')[0] ===
                  collection[colNameKey]
              )
              .map((predicate) => {
                const flat = flattenNames(predicate);
                flat[fc.NAME] = flat[fc.NAME].replace(
                  `${collection[colNameKey].split('/')[0]}/`,
                  ''
                );
                return flat;
              }),
          };
        }),
    ],
  };

  const flureeParser = new FlureeSchemaParser();
  const canonicalSchemaFromFluree = flureeParser.parse(existingFlureeSchema);

  console.log(JSON.stringify(canonicalSchemaFromFluree, null, 2));
}

export default flureeGenerator;
