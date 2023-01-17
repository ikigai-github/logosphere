import fs from 'fs-extra';
import path from 'path';

export class FileUtil {
  /**
   * write to the file if the file exits, else create the file and then write to it
   * utilises promises from fs module
   *
   * @param {*} filePath : fileName
   * @param {*} data : data to save
   */
  write(filePath: string, data: any) {
    try {
      fs.writeFileSync(
        path.resolve(filePath),
        JSON.stringify(data, null, '\t'),
        { encoding: 'utf-8' }
      );
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }

  /**
   * reads data from the file
   * @param {*} fileName : fileName
   * @returns : fileData
   */
  read(filePath: string): string {
    try {
      const data = fs.readFileSync(path.resolve(filePath), {
        encoding: 'utf-8',
      });
      return data;
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }

  /**
   * copies file from source to destination
   * @param source
   * @param target
   */
  copy(source: string, target: string) {
    try {
      fs.copyFileSync(source, target);
    } catch (error: any) {
      throw new Error(error.toString());
    }
  }
}
