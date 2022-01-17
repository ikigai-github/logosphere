import * as chalk from 'chalk';
import { Answers, Question, createPromptModule } from 'inquirer';

import { Input } from '@nestjs/cli/commands';
import { getValueOrDefault } from '@nestjs/cli/lib/compiler/helpers/get-value-or-default';
import {
  Collection,
  CollectionFactory,
} from '../lib/schematics';
import { MESSAGES } from '../lib/ui';
import { SchemaType } from '@logosphere/sdk/lib/codegen/schema-type';
import { ConverterFactory } from '@logosphere/sdk/lib/codegen';
import { jsonFederatedSchemaLoader, JsonFederatedSchema } from '@logosphere/sdk/dist/lib/codegen/json-schema';
import { GqlFederatedSchema } from '@logosphere/sdk/dist/lib/codegen/gql';
import {  
  AbstractCollection,  
  SchematicOption, } from '@nestjs/cli/lib/schematics';
import { generateSelect } from '@nestjs/cli/lib/questions/questions';
import { loadConfiguration as loadNestConfiguration } from '@nestjs/cli/lib/utils/load-configuration';
import { loadConfiguration as loadLogosphereConfiguration, ModuleConfiguration } from '@logosphere/sdk/dist/lib/configuration';
import { shouldGenerateSpec } from '@nestjs/cli/lib/utils/project-utils';
import { AbstractAction } from '@nestjs/cli/actions';
import { ConsoleLogger } from '@nestjs/common';

export class GenerateAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    await generateFiles(inputs.concat(options));
  }
}

const generateFiles = async (inputs: Input[]) => {
  const nestConfig = await loadNestConfiguration();
  const config = loadLogosphereConfiguration();
  const collectionOption = inputs.find(
    (option) => option.name === 'collection',
  )!.value as string;
  const schematic = inputs.find((option) => option.name === 'schematic')!
    .value as string;
  const appName = inputs.find((option) => option.name === 'project')!
    .value as string;
  const spec = inputs.find((option) => option.name === 'spec');

  const collection: AbstractCollection = CollectionFactory.create(
    collectionOption || nestConfig.collection || Collection.LOGOSPHERE,
  );
  const schematicOptions: SchematicOption[] = mapSchematicOptions(inputs);
  schematicOptions.push(
    new SchematicOption('language', nestConfig.language),
  );

  let sourceRoot = appName
    ? getValueOrDefault(nestConfig, 'sourceRoot', appName)
    : nestConfig.sourceRoot;

  const specValue = spec!.value as boolean;
  const specOptions = spec!.options as any;
  const generateSpec = shouldGenerateSpec(
    nestConfig,
    schematic,
    appName,
    specValue,
    specOptions.passedAsInput,
  ) || false;

  schematicOptions.push(new SchematicOption('sourceRoot', sourceRoot));
  schematicOptions.push(new SchematicOption('spec', generateSpec));
  
  try {
    const schematicInput = inputs.find((input) => input.name === 'schematic');
    if (!schematicInput) {
      throw new Error('Unable to find a schematic for this configuration');
    }

    const module = await selectModule(config.modules);
    schematicOptions.push(new SchematicOption('module', module.name));
    schematicOptions.push(new SchematicOption('name', module.name));
    

    if ((schematicInput.value === 'sch' || 
        schematicInput.value === 'schema')) {
      const schemaType = await selectSchemaType();
      schematicOptions.push(new SchematicOption('schemaType', schemaType));

      const converter = ConverterFactory.getConverter(SchemaType.Json, schemaType);
      const federatedJsonSchemas: JsonFederatedSchema[] = jsonFederatedSchemaLoader();

      let targetSchema: any;
      if (schemaType === SchemaType.Gql) {
        const federatedGqlSchemas: GqlFederatedSchema[] = converter.convert(federatedJsonSchemas);
        targetSchema = federatedGqlSchemas.find((schema: GqlFederatedSchema) => schema.module === module.name).schema;
    
        if (!targetSchema) {
          throw Error(`No ${schemaType} schema was generated for ${module.name}.`);
        }
        schematicOptions.push(new SchematicOption('content', targetSchema));
      }
      else {
        targetSchema = converter.convert(federatedJsonSchemas.find((schema: JsonFederatedSchema) => schema.module === module.name).schema);
        if (!targetSchema || targetSchema.length === 0) {
          throw Error(`No ${schemaType} schema was generated for ${module.name}.`);
        }
        schematicOptions.push(new SchematicOption('content', targetSchema.replace(/\"/gi, '\\"')));
      }
    }

    await collection.execute(schematicInput.value as string, schematicOptions);
    
  } catch (error) {
    if (error && error.message) {
      console.error(chalk.red(error.message));
    }
  }
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

const selectModule = async (modules: ModuleConfiguration[]): Promise<ModuleConfiguration> => {
  const answers: Answers = await askForModule(modules);
  return modules.find((m: ModuleConfiguration) => m.name === answers['module']);
};

const askForModule = async (modules: ModuleConfiguration[]): Promise<Answers> => {
  const questions: Question[] = [
    generateSelect('module')(MESSAGES.GENERATE_ITEM_MODULE_QUESTION)(
      modules.map((module: ModuleConfiguration) => { return module.name })
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
      SchemaType.Canonical
    ]),
  ];
  const prompt = createPromptModule();
  return await prompt(questions);
};