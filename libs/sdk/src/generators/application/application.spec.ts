import { applicationGenerator as angularApplicationGenerator } from '@nrwl/angular/generators';
import type { Tree } from '@nrwl/devkit';
import * as devkit from '@nrwl/devkit';
import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import * as semver from 'semver';
import {
  nestJsSchematicsVersion,
  nestJsVersion7,
  nestJsVersion8,
  rxjsVersion6,
  rxjsVersion7,
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
    console.log(
      JSON.stringify(
        tree.listChanges().map((fc) => fc.path),
        null,
        2
      )
    );
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
    it('should use NestJs 8 for empty workspace', async () => {
      await applicationGenerator(tree, { name: appName });
      const pkg = devkit.readJson(tree, `package.json`);

      expect(pkg.dependencies['rxjs']).toBe(rxjsVersion7);
      expect(pkg.dependencies['@nestjs/common']).toBe(nestJsVersion8);
      expect(pkg.devDependencies['@nestjs/schematics']).toBe(
        nestJsSchematicsVersion
      );
    }, 100000);

    it(`should use NestJs 8 for Angular + RxJS 7 (${rxjsVersion7}) workspace`, async () => {
      await angularApplicationGenerator(tree, { name: 'angular-app' });

      let pkg = devkit.readJson(tree, 'package.json');
      pkg.dependencies['rxjs'] = rxjsVersion7;
      tree.write('package.json', JSON.stringify(pkg));

      await applicationGenerator(tree, { name: appName });

      pkg = devkit.readJson(tree, 'package.json');

      expect(pkg.dependencies['rxjs']).toBe(rxjsVersion7);
      expect(pkg.dependencies['@nestjs/common']).toBe(nestJsVersion8);
      expect(pkg.devDependencies['@nestjs/schematics']).toBe(
        nestJsSchematicsVersion
      );
    }, 100000);

    it('should use NestJs 8 for Angular + RxJS 7 (7.4.0) workspace', async () => {
      await angularApplicationGenerator(tree, { name: 'angular-app' });

      let pkg = devkit.readJson(tree, 'package.json');
      pkg.dependencies['rxjs'] = '~7.4.0';
      tree.write('package.json', JSON.stringify(pkg));

      await applicationGenerator(tree, { name: appName });

      pkg = devkit.readJson(tree, 'package.json');

      expect(pkg.dependencies['rxjs']).toBe('~7.4.0');
      expect(pkg.dependencies['@nestjs/common']).toBe(nestJsVersion8);
      expect(pkg.devDependencies['@nestjs/schematics']).toBe(
        nestJsSchematicsVersion
      );
    }, 100000);

    it('should use NestJs 7 for Angular + RxJS 6 workspace', async () => {
      await angularApplicationGenerator(tree, { name: 'angular-app' });
      devkit.updateJson(tree, 'package.json', (json) => {
        json.dependencies.rxjs = rxjsVersion6;
        return json;
      });

      await applicationGenerator(tree, { name: appName });

      const pkg = devkit.readJson(tree, `package.json`);

      expect(semver.minVersion(pkg.dependencies['rxjs']).major).toBe(
        semver.minVersion(rxjsVersion6).major
      );
      expect(pkg.dependencies['@nestjs/common']).toBe(nestJsVersion7);
      expect(pkg.devDependencies['@nestjs/schematics']).toBe(
        nestJsSchematicsVersion
      );
    }, 100000);
  });
});
