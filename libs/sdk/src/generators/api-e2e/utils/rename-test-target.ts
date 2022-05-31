import { Tree, updateJson } from '@nrwl/devkit';
import { NormalizedSchema } from '../api-e2e';
export function renameTestTarget(tree: Tree, options: NormalizedSchema) {
  updateJson(tree, `${options.projectRoot}/project.json`, (prjJson) => {
    const test = prjJson.targets.test;
    prjJson.targets['e2e'] = test;
    delete prjJson.targets.test;
    return prjJson;
  });
}
