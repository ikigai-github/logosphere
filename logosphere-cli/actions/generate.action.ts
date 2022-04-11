import * as chalk from 'chalk';
import * as fs from 'fs';
import { Answers, Question, createPromptModule } from 'inquirer';
import * as inquirer from 'inquirer';
import { Input } from '@nestjs/cli/commands';
import { generateInput } from '@nestjs/cli/lib/questions/questions';
import { getValueOrDefault } from '@nestjs/cli/lib/compiler/helpers/get-value-or-default';
import { Collection, CollectionFactory } from '../lib/schematics';
import { MESSAGES } from '../lib/ui';
import { SchemaType } from '@logosphere/sdk/lib/codegen/schema-type';
import { canonicalSchemaLoader, ConverterFactory } from '@logosphere/sdk/lib/codegen';
import {
  jsonFederatedSchemaLoader,
  JsonFederatedSchema,
} from '@logosphere/sdk/dist/lib/codegen/json-schema';
import { FileSystemReader } from '@logosphere/sdk/dist/lib/readers';
import { GqlFederatedSchema } from '@logosphere/sdk/dist/lib/codegen/gql';
import {
  AbstractCollection,
  SchematicOption,
} from '@nestjs/cli/lib/schematics';
import { generateSelect } from '@nestjs/cli/lib/questions/questions';
import { loadConfiguration as loadNestConfiguration } from '@nestjs/cli/lib/utils/load-configuration';
import {
  loadConfiguration as loadLogosphereConfiguration,
  ModuleConfiguration,
  Configuration,
} from '@logosphere/sdk/dist/lib/configuration';
import { shouldGenerateSpec } from '@nestjs/cli/lib/utils/project-utils';
import { AbstractAction } from '@nestjs/cli/actions';
import { DtoSchema } from '@logosphere/sdk/lib/codegen/dto/dto.schema';
import { createTestDb } from '@logosphere/sdk/lib/test-data';

export class GenerateAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    await generateFiles(inputs.concat(options));
  }
}

const getModuleNameInput = (inputs: Input[]) =>
  inputs.find((input) => input.name === 'name');

const generateFiles = async (inputs: Input[]) => {
  const nestConfig = await loadNestConfiguration();
  const config = loadLogosphereConfiguration();
  const collectionOption = inputs.find((option) => option.name === 'collection')
    .value as string;

  const collection: AbstractCollection = CollectionFactory.create(
    collectionOption || nestConfig.collection || Collection.LOGOSPHERE,
  );

  try {
    const schematicInput = inputs.find((input) => input.name === 'schematic');
    if (!schematicInput) {
      throw new Error('Unable to find a schematic for this configuration');
    }
    const schematicOptions = buildSchematicOptions(inputs, nestConfig);

    if (
      (schematicInput.value === 'm' || schematicInput.value === 'module') &&
      config.model === 'code-first'
    ) {
      const module = await askModuleName(inputs);
      schematicOptions.push(new SchematicOption('name', module.name));
      schematicOptions.push(new SchematicOption('module', module.name));
      await collection.execute(
        schematicInput.value as string,
        schematicOptions,
      );
    }

    if (schematicInput.value === 'sch' || schematicInput.value === 'schema') {
      const module = await selectModule(config);
      const schemaType = await selectSchemaType();
      schematicOptions.push(new SchematicOption('schemaType', schemaType));

      const converter = config.model === 'schema-first' 
        ? ConverterFactory.getConverter(
          SchemaType.Json,
          schemaType
        )
        : ConverterFactory.getConverter(
          SchemaType.Canonical,
          schemaType
        )

      const inputSchema = config.model === 'schema-first' 
          ?  jsonFederatedSchemaLoader()
          : canonicalSchemaLoader()
     

      let targetSchema: any;
      if (schemaType === SchemaType.Gql) {
        const federatedGqlSchemas: GqlFederatedSchema[] =
          converter.convert(inputSchema);
        targetSchema = federatedGqlSchemas.find(
          (schema: GqlFederatedSchema) => schema.module === module.name,
        ).schema;

        if (!targetSchema) {
          throw Error(
            `No ${schemaType} schema was generated for ${module.name}.`,
          );
        }
        schematicOptions.push(new SchematicOption('name', module.name));
        schematicOptions.push(new SchematicOption('module', module.name));
        schematicOptions.push(new SchematicOption('content', targetSchema));
        await collection.execute(
          schematicInput.value as string,
          schematicOptions,
        );
      } else {
        targetSchema = config.model === 'schema-first'
        ? converter.convert(
            (inputSchema as JsonFederatedSchema[]).find(
              (schema: JsonFederatedSchema) => schema.module === module.name,
            ).schema,
          )
        : converter.convert(inputSchema);

        if (!targetSchema || targetSchema.length === 0) {
          throw Error(
            `No ${schemaType} schema was generated for ${module.name}.`,
          );
        }
        schematicOptions.push(new SchematicOption('name', module.name));
        schematicOptions.push(new SchematicOption('module', module.name));
        schematicOptions.push(
          new SchematicOption('content', targetSchema.replace(/\"/gi, '\\"')),
        );
        await collection.execute(
          schematicInput.value as string,
          schematicOptions,
        );
      }
    } else if (schematicInput.value === 'dto') {

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
    } else if (schematicInput.value === 'test-data') {
      const module = await selectModule(config);
      createTestDb(module.name);
    } 
  } catch (error) {
    if (error && error.message) {
      console.error(chalk.red(error.message));
    }
  }
};

const buildSchematicOptions = (
  inputs: Input[],
  nestConfig,
): SchematicOption[] => {
  const schematic = inputs.find((option) => option.name === 'schematic')
    .value as string;
  const appName = inputs.find((option) => option.name === 'project')
    .value as string;
  const spec = inputs.find((option) => option.name === 'spec');

  const schematicOptions: SchematicOption[] = mapSchematicOptions(inputs);
  schematicOptions.push(new SchematicOption('language', nestConfig.language));

  const sourceRoot = appName
    ? getValueOrDefault(nestConfig, 'sourceRoot', appName)
    : nestConfig.sourceRoot;

  const specValue = spec.value as boolean;
  const specOptions = spec.options as any;
  const generateSpec =
    shouldGenerateSpec(
      nestConfig,
      schematic,
      appName,
      specValue,
      specOptions.passedAsInput,
    ) || false;

  schematicOptions.push(new SchematicOption('sourceRoot', sourceRoot));
  schematicOptions.push(new SchematicOption('spec', generateSpec));

  return schematicOptions;
};

const mapSchematicOptions = (inputs: Input[]): SchematicOption[] => {
  const excludedInputNames = ['schematic', 'spec'];
  const options: SchematicOption[] = [];
  inputs.forEach((input) => {
    if (!excludedInputNames.includes(input.name) && input.value !== undefined) {
      options.push(new SchematicOption(input.name, input.value));
    }
  });
  return options;
};

const askModuleName = async (inputs: Input[]): Promise<ModuleConfiguration> => {
  const prompt: inquirer.PromptModule = inquirer.createPromptModule();
  const moduleNameInput = getModuleNameInput(inputs);
  if (!moduleNameInput.value) {
    const message = 'What name would you like to use for the module?';
    const questions = [generateInput('name', message)('new-module')];
    return await prompt(questions as ReadonlyArray<Question>);
  }
};

const selectModule = async (
  config: Configuration,
): Promise<Partial<ModuleConfiguration>> => {
  const modules =
    config.model === 'schema-first'
      ? config.modules
      : fs
          .readdirSync('src', { withFileTypes: true })
          .filter((dirent) => dirent.isDirectory())
          .map((dirent) => {
            return { name: dirent.name };
          });

  const answers: Answers = await askForModule(modules);
  return modules.find(
    (m: Partial<ModuleConfiguration>) => m.name === answers['module'],
  );
};

const askForModule = async (
  modules: Partial<ModuleConfiguration>[],
): Promise<Answers> => {
  const questions: Question[] = [
    generateSelect('module')(MESSAGES.GENERATE_ITEM_MODULE_QUESTION)(
      modules.map((module: ModuleConfiguration) => {
        return module.name;
      }),
    ),
  ];
  const prompt = createPromptModule();
  return await prompt(questions);
};

const selectSchemaType = async (): Promise<SchemaType> => {
  const answers: Answers = await askForSchemaType();
  return answers['schemaType'];
};

const askForSchemaType = async (): Promise<Answers> => {
  const questions: Question[] = [
    generateSelect('schemaType')(MESSAGES.GENERATE_SCHEMA_TYPE_QUESTION)([
      SchemaType.Gql,
      SchemaType.Fluree,
      SchemaType.Canonical,
    ]),
  ];
  const prompt = createPromptModule();
  return await prompt(questions);
};
