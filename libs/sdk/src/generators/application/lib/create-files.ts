import type { Tree } from '@nrwl/devkit';
import { generateFiles, joinPathFragments } from '@nrwl/devkit';
import type { NormalizedOptions } from '../schema';

export function createFiles(tree: Tree, options: NormalizedOptions): void {
  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.appProjectRoot,
    {
      tmpl: '',
      name: options.name,
      className: options.className,
      dashedName: options.dashedName,
      cameledName: options.cameledName,
      root: options.appProjectRoot,
    }
  );
}
