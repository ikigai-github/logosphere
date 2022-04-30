import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, updateJson } from '@nrwl/devkit';
import type { NormalizedOptions } from '../schema';

export function updateProject(tree: Tree, options: NormalizedOptions): void {
  updateJson(
    tree,
    joinPathFragments(options.appProjectRoot, 'project.json'),
    (json) => {
      json.targets['build-model'] = {
        executor: '@nrwl/js:tsc',
        outputs: [`dist/apps/${options.name}`],
        options: {
          outputPath: `dist/apps/${options.name}`,
          tsConfig: `apps/${options.name}/tsconfig.model.json`,
          main: `apps/${options.name}/src/main.ts`
        }
      }
      return json;
    }
  );
}
