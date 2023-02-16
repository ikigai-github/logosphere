import { generateFiles, getProjects, Tree } from '@nrwl/devkit';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import randomstring from 'randomstring';
import promptSync from 'prompt-sync';
import { HelmApplication, TemplateType, HelmGeneratorOptions } from './schema';

const prompt = promptSync();
const FILES_DIRECTORY = 'files';
const PROMPT_VALUES = ['yes', 'y', 'no', 'n'];
const RED_CODE = '\x1b[31m';
const GREEN_CODE = '\x1b[32m';
const WHITE_CODE = '\x1b[0m';
const BLUE_CODE = '\x1b[94m';

function colorize(items: string[], colorCode: string): string {
  return items.map((fileName) => colorCode + fileName + WHITE_CODE).join(', ');
}

export default async function (
  tree: Tree,
  generatorOptions: HelmGeneratorOptions
) {
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

  const helper = new HelmGeneratorHelper(tree, generatorOptions);
  helper.do(applications);

  // prettier has yaml support, but limitted jinja support which is what helm
  // tends to use. So just skip the formatting
  // await formatFiles(tree);
}

class HelmGeneratorHelper {
  options: HelmGeneratorOptions;
  tree: Tree;
  flureeChartPath: string = path.join('helm', 'charts', 'fluree-ledger');
  templateConfigBase: TemplateType;

  constructor(tree: Tree, options: HelmGeneratorOptions) {
    this.options = options;
    this.tree = tree;
    this.templateConfigBase = {
      ...this.options,
      password: randomstring.generate(50),
    };
  }

  do(applications: Array<HelmApplication>) {
    this.generateLogosphereCharts(applications);
    this.generateApplicationCharts(applications);
  }

  generateLogosphereCharts(applications: HelmApplication[]) {
    let templatedChartDir = path.join('helm');
    generateFiles(
      this.tree,
      path.join(__dirname, FILES_DIRECTORY, 'logosphere-chart'),
      path.join(templatedChartDir),
      { ...this.templateConfigBase, applications: applications }
    );
  }

  generateApplicationCharts(applications: HelmApplication[]) {
    for (const application of applications) {
      let templatedChartDir = path.join('helm', 'charts', application.name);
      if (
        !fs.existsSync(templatedChartDir) ||
        this.promptConfirmed(application.name)
      ) {
        if (this.options.buildImages) {
          console.log(
            colorize(
              [
                `\n*** Start Docker Output (pnpm nx docker ${application.name}) ***`,
              ],
              BLUE_CODE
            )
          );
          execSync(`pnpm nx docker ${application.name}`, {
            cwd: this.tree.root,
          });
          console.log(
            colorize(['\n*** End Docker Output ***'], BLUE_CODE) + '\n'
          );
        }
        generateFiles(
          this.tree,
          path.join(__dirname, FILES_DIRECTORY, 'app-chart'),
          path.join(templatedChartDir),
          { ...this.templateConfigBase, application: application }
        );
      }
    }
  }

  promptConfirmed(applicationName: string): boolean {
    if (this.options.force) {
      return true;
    }
    const coloredAppName = colorize([applicationName], RED_CODE);
    const coloredPromptValues = colorize(PROMPT_VALUES, GREEN_CODE);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const input = prompt(
        `Helm chart for ${coloredAppName} already exists. Override and continue? (y/n): `
      )?.toLocaleLowerCase();
      if (PROMPT_VALUES.includes(input)) {
        return input === 'y' || input === 'yes' ? true : false;
      } else if (input !== undefined) {
        console.log(`Only ${coloredPromptValues} values accepted`);
      } else {
        return false;
      }
    }
  }
}
