import {
  formatFiles,
  generateFiles,
  getProjects,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import randomstring from 'randomstring';
import promptSync from 'prompt-sync';
import { existsSync, readdirSync } from 'fs';
import { TemplateType } from './schema';

const prompt = promptSync();
const FILES_DIRECTORY = 'files'
const PROMPT_VALUES = ['yes', 'y', 'no', 'n'];
const RED_CODE = '\x1b[31m';
const GREEN_CODE = '\x1b[32m';
const WHITE_CODE = '\x1b[0m';


function getClearFileName(fileName: string, templateConfig: TemplateType): string {
  let clearName = fileName;
  Object.keys(templateConfig).forEach(key => {
    clearName = clearName.replace(`__${key}__`, templateConfig[key].toString())
  })
  return clearName;
}

function colorize(items: string[], colorCode: string): string {
  return items
    .map(fileName => colorCode + fileName + WHITE_CODE)
    .join(', ')
}

function promptConfirmed(existingFiles: string[]): boolean {
  const coloredFileNames = colorize(existingFiles, RED_CODE);
  const coloredPromptValues = colorize(PROMPT_VALUES, GREEN_CODE);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const input = prompt(`Files: ${coloredFileNames} already exist. Override and continue? (y/n): `)?.toLocaleLowerCase();
    if (PROMPT_VALUES.includes(input)) {
      return input === 'y' || input === 'yes' ? true : false;
    }
    else if (input !== undefined) {
      console.log(`Only ${coloredPromptValues} values accepted`);
    }
    else {
      return false;
    }
  }
}

export default async function (tree: Tree) {
  const applications = [...getProjects(tree).entries()]
    .filter(([key, value]) => !key.includes('e2e') && value.projectType === 'application')
    .map(([key, value], index) => ({ name: key, port: 4000 + index, path: value.root }))
  const templateConfig = {
    dot: '.',
    template: '',
    applications,
    password: randomstring.generate(50)
  }
  const existingFiles = readdirSync(`${__dirname}/${FILES_DIRECTORY}`, { withFileTypes: true })
    .filter(file => file.isFile())
    .map(file => getClearFileName(file.name, templateConfig))
    .filter(fileName => existsSync(`${tree.root}/${fileName}`));

  if (!existingFiles.length || promptConfirmed(existingFiles)) {
    generateFiles(tree, path.join(__dirname, FILES_DIRECTORY), '', templateConfig);
    await formatFiles(tree);
  }
}