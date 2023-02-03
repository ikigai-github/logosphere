import type { Tree } from '@nrwl/devkit';
import * as devkit from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import {
  nestJsSchematicsVersion,
  nestJsVersion,
  rxjsVersion,
} from '../../utils/versions';
import { applicationGenerator } from './application';

describe('application generator', () => {
  let tree: Tree;
  const appName = 'node-app';
  const appDirectory = 'apps';

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
    jest.clearAllMocks();
  });

  it('should generate files', async () => {
    await applicationGenerator(tree, {
      name: appName,
      directory: appDirectory,
    });
    expect(tree.exists(`${appDirectory}/${appName}/src/main.ts`)).toBeTruthy();
    expect(
      tree.exists(`${appDirectory}/${appName}/src/app/app.module.ts`)
    ).toBeTruthy();
  }, 100000);

  it('should configure tsconfig correctly', async () => {
    await applicationGenerator(tree, {
      name: appName,
      directory: appDirectory,
    });

    const tsConfig = devkit.readJson(
      tree,
      `${appDirectory}/${appName}/tsconfig.app.json`
    );
    expect(tsConfig.compilerOptions.emitDecoratorMetadata).toBe(true);
    expect(tsConfig.compilerOptions.target).toBe('es2015');
    expect(tsConfig.exclude).toEqual([
      'jest.config.ts',
      'src/**/*.spec.ts',
      'src/**/*.test.ts',
    ]);
  }, 100000);

  describe('--skipFormat', () => {
    it('should format files', async () => {
      jest.spyOn(devkit, 'formatFiles');

      await applicationGenerator(tree, { name: appName });

      expect(devkit.formatFiles).toHaveBeenCalled();
    }, 100000);

    it('should not format files when --skipFormat=true', async () => {
      jest.spyOn(devkit, 'formatFiles');

      await applicationGenerator(tree, { name: appName, skipFormat: true });

      expect(devkit.formatFiles).not.toHaveBeenCalled();
    }, 100000);
  });

  describe('NestJS versions', () => {
    it('should use NestJs 9 for empty workspace', async () => {
      await applicationGenerator(tree, { name: appName });
      const pkg = devkit.readJson(tree, `package.json`);

      expect(pkg.dependencies['rxjs']).toBe(rxjsVersion);
      expect(pkg.dependencies['@nestjs/common']).toBe(nestJsVersion);
      expect(pkg.devDependencies['@nestjs/schematics']).toBe(
        nestJsSchematicsVersion
      );
    }, 100000);
  });
});
