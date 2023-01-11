import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './module';
import { NodeLibraryGeneratorSchema } from './schema';

describe('module generator', () => {
  let tree: Tree;
  const options: NodeLibraryGeneratorSchema = {
    name: 'test',
    directory: 'libs/codegen',
    compiler: 'tsc',
  };

  beforeEach(() => {
    tree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(tree, options);
    const config = readProjectConfiguration(tree, 'codegen-test');
    expect(config).toBeDefined();
  });

  it('should generate files', async () => {
    console.log(JSON.stringify(options, null, 2));
    await generator(tree, options);
    console.log(
      JSON.stringify(
        tree.listChanges().map((fc) => fc.path),
        null,
        2
      )
    );
    expect(
      tree.exists(`${options.directory}/${options.name}/package.json`)
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/${options.name}.config.json`
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/${options.name}.model.ts`
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/${options.name}.module.ts`
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/${options.name}.test-data.json`
      )
    ).toBeTruthy();
    expect(
      tree.exists(`${options.directory}/${options.name}/src/dto/index.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(`${options.directory}/${options.name}/src/entities/index.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/enum-types/index.ts`
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/mappers/dto/index.ts`
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/mappers/fluree/index.ts`
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/repositories/interfaces/index.ts`
      )
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/repositories/fluree/index.ts`
      )
    ).toBeTruthy();
    expect(
      tree.exists(`${options.directory}/${options.name}/src/resolvers/index.ts`)
    ).toBeTruthy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/lib/codegen-${options.name}.ts`
      )
    ).toBeFalsy();
    expect(
      tree.exists(
        `${options.directory}/${options.name}/src/lib/codegen-${options.name}.spec.ts`
      )
    ).toBeFalsy();
  });
});
