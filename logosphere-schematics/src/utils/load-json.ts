import * as fs from 'fs';
export const loadJson = (path: string): any => {
  return JSON.parse(fs.readFileSync(path, 'utf-8'));
}