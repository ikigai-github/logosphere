/* eslint-disable @typescript-eslint/no-explicit-any */
import { isScalarArray } from './is-array.util';

export function copySubjectId(
  existing: any,
  updated: any,
  id = 'id',
  subjectId = 'subjectId'
): any {
  const _id =
    Object.keys(existing).find(
      (key: string) =>
        key === id || (key.split('/').length > 1 && key.split('/')[1] === id)
    ) || id;
  if (existing[_id] === updated[_id]) {
    updated[subjectId] = existing[subjectId];
    Object.keys(updated).map((key: string) => {
      if (
        typeof updated[key] === 'object' &&
        !Array.isArray(updated[key]) &&
        existing[key]
      ) {
        return copySubjectId(existing[key], updated[key], id, subjectId);
      } else if (Array.isArray(updated[key]) && !isScalarArray(updated[key])) {
        return updated[key].map((upd: any) => {
          const _arrId =
            Object.keys(upd).find(
              (key: string) =>
                key === id ||
                (key.split('/').length > 1 && key.split('/')[1] === id)
            ) || id;
          const ex = existing[key].find(
            (exs: any) => exs[_arrId] === upd[_arrId]
          );
          if (ex) {
            return copySubjectId(ex, upd, id, subjectId);
          } else {
            return upd;
          }
        });
      }
    });
  }
  return updated;
}
