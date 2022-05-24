import * as rs from 'randomstring';
import { DefinitionType, Property } from '../canonical';
function getRandom(arr: any[]): any {
  return arr && arr.length > 0
    ? arr[Math.floor(Math.random() * arr.length)]
    : undefined;
}

function getFirst(arr: any[]): number {
  return arr && arr.length > 0 ? arr[0] : undefined;
}

/**
 * Returns one example for a property in the canonical schema
 * @param prop Canonical schema property
 * @param random If true, the value will be taken randomly from the array of examples, or take first example otherwise
 * @returns example
 */
export function propExample(prop: Property, random = false) {
  const val = random ? getRandom(prop.examples) : getFirst(prop.examples);
  let ret;
  switch (prop.defType) {
    case DefinitionType.Scalar:
    case DefinitionType.ScalarArray:
      switch (prop.type) {
        case 'string':
          ret = val
            ? val
            : rs.generate({
                length: prop.maxLength,
                charset: 'alphabetic',
              });
          break;
        case 'number':
          ret = val ? +val : Math.floor(Math.random() * 10);
          break;
        case 'boolean':
          ret = random ? getRandom([true, false]) : true;
          break;
        default:
          ret = '';
      }
      break;
    case DefinitionType.Enum:
    case DefinitionType.EnumArray:
      ret = val[0];
      break;
    default:
      ret = '';
  }
  return prop.defType === DefinitionType.ScalarArray ||
    prop.defType === DefinitionType.EnumArray
    ? [ret]
    : ret;
}
