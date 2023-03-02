import { readRootPackageJson, Tree } from '@nrwl/devkit';
import { generateFiles, joinPathFragments } from '@nrwl/devkit';
import type { NormalizedOptions } from '../schema';

export function createFiles(tree: Tree, options: NormalizedOptions, codeGenPrefix: string): void {
  const rootProjectName = readRootPackageJson()['name']

  generateFiles(
    tree,
    joinPathFragments(__dirname, '..', 'files'),
    options.appProjectRoot,
    {
      tmpl: '',
      name: options.name,
      className: options.className,
      libName: options.libName,
      root: options.appProjectRoot,
      moduleName: options.name[0].toUpperCase() + options.name.slice(1),
      importPath: `@${rootProjectName}/${options.name}-${codeGenPrefix}`
    }
  );
}
