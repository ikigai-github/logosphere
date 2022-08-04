import type { Tree } from '@nrwl/devkit';
import { joinPathFragments, updateJson } from '@nrwl/devkit';
import type { NormalizedOptions } from '../schema';

export function updateTsConfigApp(
  tree: Tree,
  options: NormalizedOptions
): void {
  updateJson(
    tree,
    joinPathFragments(options.appProjectRoot, 'tsconfig.app.json'),
    (json) => {
      json.outDir = '../../dist';
      json.compilerOptions.emitDecoratorMetadata = true;
      json.compilerOptions.target = 'es2015';
      return json;
    }
  );
}
