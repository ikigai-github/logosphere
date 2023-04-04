import * as path from 'path';
export const editFileName = (req, file, callback) => {
  try {
    const name = file.originalname.split('.')[0];
    const fileExtName = path.extname(file.originalname);
    const randomName = Array(4)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
  } catch (err: any) {
    console.log(JSON.stringify(err, null, 2));
  }
};