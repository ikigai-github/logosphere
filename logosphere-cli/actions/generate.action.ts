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
import {  
  AbstractCollection,  
  SchematicOption, } from '@nestjs/cli/lib/schematics';
import { generateSelect } from '@nestjs/cli/lib/questions/questions';
import { ModuleConfiguration } from '@logosphere/sdk/dist/lib/configuration';
import { loadConfiguration as loadNestConfiguration } from '@nestjs/cli/lib/utils/load-configuration';
import { loadConfiguration as loadLogosphereConfiguration } from '../lib/utils/load-configuration';
import { shouldGenerateSpec } from '@nestjs/cli/lib/utils/project-utils';
import { AbstractAction } from '@nestjs/cli/actions';

export class GenerateAction extends AbstractAction {
  public async handle(inputs: Input[], options: Input[]) {
    await generateFiles(inputs.concat(options));
  }
}

const generateFiles = async (inputs: Input[]) => {
  const nestConfig = await loadNestConfiguration();
  const lgsConfig = await loadLogosphereConfiguration();
  //console.log(lgsConfig);
  

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
  let generateSpec = shouldGenerateSpec(
    nestConfig,
    schematic,
    appName,
    specValue,
    specOptions.passedAsInput,
  );

  schematicOptions.push(new SchematicOption('sourceRoot', sourceRoot));
  schematicOptions.push(new SchematicOption('spec', generateSpec));
  try {
    const schematicInput = inputs.find((input) => input.name === 'schematic');
    if (!schematicInput) {
      throw new Error('Unable to find a schematic for this configuration');
    }
    if (schematicInput.value === 'sch') {
      const schemaType = await selectSchemaType();
      schematicOptions.push(new SchematicOption('schemaType', schemaType))
    }
    const module = await selectModule(lgsConfig.modules);
    schematicOptions.push(new SchematicOption('module', module.name));
    schematicOptions.push(new SchematicOption('hackoladeSchemaFile', module.hackoladeSchemaFile));
    schematicOptions.push(new SchematicOption('jsonSchemaFile', module.jsonSchemaFile));
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
      SchemaType.GQL,
      SchemaType.FLUREE,
      SchemaType.CANONICAL
    ]),
  ];
  const prompt = createPromptModule();
  return await prompt(questions);
};