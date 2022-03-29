import * as fs from 'fs';
import { Reader } from './reader';
export class FileSystemReader implements Reader {

  constructor(public readonly directory: string) {}

  public list(): string[] {
    return fs.readdirSync(this.directory);
  }

  public read(name: string): string {
    return fs.readFileSync(`${this.directory}/${name}`, 'utf-8');
  }
}
