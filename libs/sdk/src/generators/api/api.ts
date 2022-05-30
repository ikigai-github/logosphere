import { Tree } from '@nrwl/devkit';
import { DEFAULT_COMPILER } from '../../common';
import { ApiGeneratorSchema } from './schema';

import { moduleGenerator } from '../module';
import { canonicalSchemaGenerator } from '../canonical';
import { dtoGenerator } from '../dto';
import { entityGenerator } from '../entity';
import { enumTypeGenerator } from '../enum-type';
import { flureeGenerator } from '../fluree';
import { gqlGenerator } from '../gql';
import { mapperGenerator } from '../mapper';
import { repositoryGenerator } from '../repository';
import { resolverGenerator } from '../resolver';

export async function apiGenerator(tree: Tree, options: ApiGeneratorSchema) {
  const module = options.name;

  await moduleGenerator(tree, {
    name: options.name,
    compiler: DEFAULT_COMPILER,
  });
  await canonicalSchemaGenerator(tree, { module });
  await dtoGenerator(tree, { module });
  await entityGenerator(tree, { module });
  await enumTypeGenerator(tree, { module });
  await flureeGenerator(tree, { module });
  await gqlGenerator(tree, { module });
  await mapperGenerator(tree, {
    module,
    type: 'dto',
  });
  await mapperGenerator(tree, {
    module,
    type: 'fluree',
  });
  await repositoryGenerator(tree, {
    module,
    type: 'interfaces',
  });
  await repositoryGenerator(tree, {
    module,
    type: 'fluree',
  });
  await resolverGenerator(tree, { module });
}

export default apiGenerator;
