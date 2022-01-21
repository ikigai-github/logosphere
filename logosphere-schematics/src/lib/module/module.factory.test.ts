import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ModuleOptions } from './module.schema';

describe('Module Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );
  it('should manage name only', async () => {
    const options: ModuleOptions = {
      name: 'foo',
      skipImport: true,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('module', options).toPromise();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/foo/foo.module.ts'),
    ).not.toBeUndefined();
  });
});