import { normalize } from '@angular-devkit/core';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ApplicationOptions } from '../application/application.schema';
import { SchemaOptions } from './schema.schema';

describe('Schema Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );
  it('should have .gql file created', async () => {
    const options: SchemaOptions = {
      name: 'foo',
      module: 'foo',
      schemaType: 'gql',
      content: 'Some GQL',
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('schema', options).toPromise();
    const files: string[] = tree.files;
    expect(
      files.find(filename => filename === '/foo/foo.schema.gql'),
    ).toBeDefined();
  });
});