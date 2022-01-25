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
  it('should create DTO file', async () => {
    const options: DtoOptions = {
      name: 'foo',
      spec: true,
      flat: false,
      content: 'DTO declarations',
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('dto', options).toPromise();
    const files: string[] = tree.files;

    expect(files.find(filename => filename === '/foo/foo.dto.ts')).not.toBeUndefined();
    
  });
});