import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ApplicationOptions } from './application.schema';

describe('Application Factory', () => {
  const runner: SchematicTestRunner = new SchematicTestRunner(
    '.',
    path.join(process.cwd(), 'src/collection.json'),
  );
  
  it('should create files', async () => {
    const options: ApplicationOptions = {
      name: 'awesomeProject',
    };
    const tree: UnitTestTree = await runner.runSchematicAsync('application', options).toPromise();
    const files: string[] = tree.files;
    expect(files).toEqual([
      '/awesome-project/.eslintrc.js',
      '/awesome-project/.gitignore',
      '/awesome-project/.prettierrc',
      '/awesome-project/README.md',
      '/awesome-project/logosphere.json',
      '/awesome-project/nest-cli.json',
      '/awesome-project/package.json',
      '/awesome-project/tsconfig.build.json',
      '/awesome-project/tsconfig.json',
      '/awesome-project/docker/local/docker-compose.yaml',
      '/awesome-project/schemas/hackolade/auction.hck.json',
      '/awesome-project/schemas/hackolade/minting.hck.json',
      '/awesome-project/schemas/hackolade/user.hck.json',
      '/awesome-project/schemas/json/auction.schema.json',
      '/awesome-project/schemas/json/minting.schema.json',
      '/awesome-project/schemas/json/user.schema.json',
      '/awesome-project/src/app.module.ts',
      '/awesome-project/src/main.ts',
      '/awesome-project/test/app.e2e-spec.ts',
      '/awesome-project/test/jest-e2e.json',
    ]);
  });
});