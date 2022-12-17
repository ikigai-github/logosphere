import {
  Definition,
  DefinitionType,
  Property,
  propExample,
} from '@logosphere/schema';

import {
  fixtures as f,
  predicates as p,
} from './fluree.fixture-generator.constants';

function generateFlureeData(
  defs: Definition[],
  currentDef: Definition,
  collectionPrefix = true,
  random = false,
  maxDepth = 1,
  currentDepth = 1
): any {
  const data = {};
  const prefix = collectionPrefix ? `${currentDef.name}/` : '';
  data[p.SUBJECT_ID] = f.SUBJECT_ID;
  data[`${prefix}${p.IDENTIFIER}`] = f.IDENTIFIER;
  data[`${prefix}${p.CREATED_AT}`] = f.CREATED_AT;
  data[`${prefix}${p.UPDATED_AT}`] = f.CREATED_AT;

  currentDef.props.map((prop: Property) => {
    if (
      prop.defType === DefinitionType.Entity ||
      prop.defType === DefinitionType.EntityArray
    ) {
      if (currentDepth <= maxDepth) {
        const refDef = defs.find((def: Definition) => def.name === prop.type);
        const value = generateFlureeData(
          defs,
          refDef,
          collectionPrefix,
          random,
          maxDepth,
          currentDepth + 1
        );
        data[`${prefix}${prop.name}`] =
          prop.defType === DefinitionType.Entity ? value : [value];
      } else {
        data[`${prefix}${prop.name}`] = null;
      }
    } else {
      data[`${prefix}${prop.name}`] = propExample(prop, random);
    }
  });

  return data;
}

/**
 * Generates Fluree data fixture from canonical schema
 * @param defs Canonical schema definitions
 * @param rootDefName Name of the root definition
 * @param collectionPrefix true, if use collection prefix in object keys
 * @param random true, if taking random example from `examples` property.
 * @param maxDepth max level of depth for nested data
 * @returns Fluree data fixture
 */
export function flureeData(
  defs: Definition[],
  rootDefName: string,
  collectionPrefix = true,
  random = false,
  maxDepth = 1
) {
  const rootDef = defs.find((d: Definition) => d.name === rootDefName);
  return generateFlureeData(
    defs,
    rootDef,
    collectionPrefix,
    random,
    maxDepth,
    1
  );
}
