import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { DtoOptions } from './dto.schema';

describe('Class Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );
  it('should manage name only', async () => {
    const options: DtoOptions = {
      name: 'foo',
      spec: true,
      flat: true,
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('dto', options).toPromise();
    const files: string[] = tree.files;

    expect(files.find(filename => filename === '/foo.dto.ts')).not.toBeUndefined();
    
  });
});