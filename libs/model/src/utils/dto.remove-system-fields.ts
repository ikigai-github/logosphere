/* eslint-disable @typescript-eslint/no-explicit-any */
import { systemFields as sf } from './dto.constants';

function removeSystemFields(dto: any): any {
  const obj = {};
  Object.keys(dto).map((key: string) => {
    if (typeof dto[key] === 'object') {
      obj[key] = removeSystemFields(dto[key]);
    } else if (
      key !== sf.ID &&
      key !== sf.SUBJECT_ID &&
      key !== sf.CREATED_AT &&
      key !== sf.UPDATED_AT
    ) {
      obj[key] = dto[key];
    }
  });
  return obj;
}

export function dtoRemoveSystemFields(dto: any): any {
  return Array.isArray(dto)
    ? dto.map((d) => removeSystemFields(d))
    : removeSystemFields(dto);
}
