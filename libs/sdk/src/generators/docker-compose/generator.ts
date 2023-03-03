import { formatFiles, generateFiles, getProjects, Tree } from '@nrwl/devkit';
import * as path from 'path';
import randomstring from 'randomstring';
import * as prompt from '../utils/user-prompt';
import { existsSync, readdirSync } from 'fs';
import { TemplateType } from './schema';

const FILES_DIRECTORY = 'files';

function getClearFileName(
  fileName: string,
  templateConfig: TemplateType
): string {
  let clearName = fileName;
  Object.keys(templateConfig).forEach((key) => {
    clearName = clearName.replace(`__${key}__`, templateConfig[key].toString());
  });
  return clearName;
}

export default async function (tree: Tree) {
  const applications = [...getProjects(tree).entries()]
    .filter(
      ([key, value]) =>
        !key.includes('e2e') && value.projectType === 'application'
    )
    .map(([key, value], index) => ({
      name: key,
      port: 4000 + index,
      path: value.root,
    }));
  const templateConfig = {
    dot: '.',
    template: '',
    applications,
    password: randomstring.generate(50),
  };
  const existingFiles = readdirSync(`${__dirname}/${FILES_DIRECTORY}`, {
    withFileTypes: true,
  })
    .filter((file) => file.isFile())
    .map((file) => getClearFileName(file.name, templateConfig))
    .filter((fileName) => existsSync(`${tree.root}/${fileName}`));

  const coloredFileNames = prompt.colorize(
    existingFiles,
    prompt.TERMINAL_COLOR_CODES.RED
  );
  if (
    !existingFiles.length ||
    prompt.validateYesNoQuestion(
      `Files: ${coloredFileNames} already exist. Override and continue? (y/n): `
    )
  ) {
    generateFiles(
      tree,
      path.join(__dirname, FILES_DIRECTORY),
      '',
      templateConfig
    );
    await formatFiles(tree);
  }
}
