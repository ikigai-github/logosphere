import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, updateJson } from '@nrwl/devkit';
import type { NormalizedOptions } from '../schema';

export function updateTsConfigSpec(
  tree: Tree,
  options: NormalizedOptions
): void {
  updateJson(
    tree,
    joinPathFragments(options.appProjectRoot, 'tsconfig.spec.json'),
    (json) => {
      json.compilerOptions.outDir = '../../dist';
      json.compilerOptions.allowJs = true;
      return json;
    }
  );
}
