import _ from 'lodash';
import { predicates as p } from '../fluree';
/**
 * Deep diff between two object, using lodash
 * @param object: Object compared
 * @param base:   Object to compare with
 * @return Return a new object who represent the diff
 *
 * Credit: https://gist.github.com/Yimiprod/7ee176597fef230d1451
 */
export function difference(object: any, base: any) {
  function changes(object: any, base: any) {
    return _.transform(object, (result: any, value: any, key: string) => {
      if (!_.isEqual(value, base[key]) || key === p._ID) {
        result[key] =
          _.isObject(value) && _.isObject(base[key])
            ? changes(value, base[key])
            : value;
        if (base[p._ID] !== undefined) {
          result[p._ID] = base[p._ID];
        }
      }
    });
  }
  return changes(object, base);
}
