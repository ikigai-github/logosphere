import * as _ from 'lodash';
import { SEPARATOR_SLASH, TYPENAME } from './const';

export type FlureeQLFragment = string | object;

/** Recursively traverse the object structure and 
    convert it to FQL JSON array 
*/
function objectToFql(
  obj: object,
  fqlFragment: FlureeQLFragment[]
): FlureeQLFragment[] {
  Object.keys(obj).map((key: string) => {
    if (Object.keys(obj[key]).length === 0) {
      fqlFragment.push(key);
    } else {
      fqlFragment.push({ [key]: objectToFql(obj[key], []) });
    }
  });
  return fqlFragment;
}

/** 
Convert selection set list to nested object with unique keys
so the 
[ 'bidHistory/user/username',
  'bidHistory/user/displayName'
]
becomes 
{ 
  bidHistory: {
    user: {
       username: {},
       displayName: {}
    }
  }
}
*/
function selectionsToObject(selectionSetList: string[]): object {
  let mergedObject = {};
  selectionSetList.map((selection: string) => {
    const obj = {};
    selection
      .split(SEPARATOR_SLASH)
      .filter((item: string) => item != TYPENAME)
      .reduce((acc: object, item: string) => {
        return (acc[item] = {});
      }, obj);
    mergedObject = _.merge(mergedObject, obj);
  });

  return mergedObject;
}

/**
 * Converts GraphQL selectionSetList object to FQL JSON select statement
 * @param selectionSetList : GraphQL selectionSetList object
 * @returns FQL JSON select statement
 */
export function gqlSelectionSetToFql(selectionSetList: string[]) {
  const obj = selectionsToObject(selectionSetList);
  const fql: FlureeQLFragment[] = [];
  objectToFql(obj, fql);
  return fql;
}
