import {
  Definition,
  DefinitionType,
  Property,
  propExample,
} from '@logosphere/schema';

import {
  fixtures as f,
  predicates as p,
} from './dto.fixture-generator.constants';

function generateDtoData(
  defs: Definition[],
  currentDef: Definition,
  random = false,
  maxDepth = 1,
  currentDepth = 1,
  gqlInput = false
): any {
  const data = {};
  if (!gqlInput) {
    data[p.SUBJECT_ID] = f.SUBJECT_ID;
    data[p.ID] = f.ID;
    data[p.CREATED_AT] = f.CREATED_AT;
    data[p.UPDATED_AT] = f.CREATED_AT;
  }

  currentDef.props.map((prop: Property) => {
    if (
      prop.defType === DefinitionType.Entity ||
      prop.defType === DefinitionType.EntityArray
    ) {
      if (currentDepth <= maxDepth) {
        const refDef = defs.find((def: Definition) => def.name === prop.type);
        const value = generateDtoData(
          defs,
          refDef,
          random,
          maxDepth,
          currentDepth + 1,
          gqlInput
        );
        data[prop.name] =
          prop.defType === DefinitionType.Entity ? value : [value];
      } else {
        data[prop.name] = null;
      }
    } else {
      data[prop.name] = propExample(prop, random);
    }
  });

  return data;
}

/**
 * Generates DTO data fixture from canonical schema
 * @param defs Canonical schema definitions
 * @param rootDefName Name of the root definition
 * @param random true, if taking random example from `examples` property.
 * @param maxDepth max level of depth for nested data
 * @returns DTO data fixture
 */
export function dtoData(
  defs: Definition[],
  rootDefName: string,
  random = false,
  maxDepth = 1,
  gqlInput = false
) {
  const rootDef = defs.find((d: Definition) => d.name === rootDefName);
  return generateDtoData(defs, rootDef, random, maxDepth, 1, gqlInput);
}
