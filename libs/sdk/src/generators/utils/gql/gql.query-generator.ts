import { Definition, DefinitionType, Property } from '@logosphere/schema';

import { system as s } from './gql.query-generator.constants';

function generateGqlQuery(
  defs: Definition[],
  currentDef: Definition,
  maxDepth = 1,
  currentDepth = 1,
  currentPropName = ''
): string {
  const indentMinus1 = '\t'.repeat(currentDepth - 1);
  const indent = '\t'.repeat(currentDepth);
  let query = `${indentMinus1}${currentPropName} {\n`;
  query += `${indent}${s.SUBJECT_ID}\n`;
  query += `${indent}${s.ID}\n`;
  query += `${indent}${s.CREATED_AT}\n`;
  query += `${indent}${s.UPDATED_AT}\n`;
  currentDef.props.map((prop: Property) => {
    if (
      prop.defType === DefinitionType.Entity ||
      prop.defType === DefinitionType.EntityArray
    ) {
      if (currentDepth <= maxDepth) {
        const refDef = defs.find((def: Definition) => def.name === prop.type);
        query += generateGqlQuery(
          defs,
          refDef,
          maxDepth,
          currentDepth + 1,
          prop.name
        );
      }
    } else {
      query += `${indent}${prop.name}\n`;
    }
  });
  query += `${indentMinus1}}\n`;
  return query;
}

/**
 * Generates nested GQL query from canonical schema
 * @param defs Canonical schema definitions
 * @param rootDefName Name of the root definition
 * @param maxDepth max level of depth for nested data
 * @returns GQL query
 */
export function gqlQuery(
  defs: Definition[],
  rootDefName: string,
  maxDepth = 1
) {
  const rootDef = defs.find((d: Definition) => d.name === rootDefName);
  return generateGqlQuery(defs, rootDef, maxDepth, 1);
}
