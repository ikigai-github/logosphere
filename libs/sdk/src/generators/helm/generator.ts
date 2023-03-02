import { generateFiles, getProjects, Tree } from '@nrwl/devkit';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import randomstring from 'randomstring';
import * as prompt from '../utils/user-prompt';
import { HelmApplication, TemplateType, HelmGeneratorOptions } from './schema';

const FILES_DIRECTORY = 'files';

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
  helper.generateAllFiles(applications);

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

  generateAllFiles(applications: Array<HelmApplication>) {
    this.generateDeploymentScripts(applications);
    this.generateLogosphereCharts(applications);
    this.generateApplicationCharts(applications);
  }

  generateDeploymentScripts(applications: HelmApplication[]) {
    generateFiles(
      this.tree,
      path.join(__dirname, FILES_DIRECTORY, 'deployment-scripts'),
      '.',
      { ...this.templateConfigBase, applications: applications }
    );
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
      let coloredAppName = prompt.colorize(
        [application.name],
        prompt.TERMINAL_COLOR_CODES.RED
      );
      if (
        !fs.existsSync(templatedChartDir) ||
        this.options.force ||
        prompt.validateYesNoQuestion(
          `Helm chart for ${coloredAppName} already exists. Override and continue? (y/n): `
        )
      ) {
        generateFiles(
          this.tree,
          path.join(__dirname, FILES_DIRECTORY, 'app-chart'),
          path.join(templatedChartDir),
          { ...this.templateConfigBase, application: application }
        );
      }
    }
  }
}
