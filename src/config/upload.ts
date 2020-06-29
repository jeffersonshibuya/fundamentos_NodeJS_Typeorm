import multer from 'multer';
import path from 'path';
import crypto from 'crypto';

const fileDirectory = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  directory: fileDirectory,

  storage: multer.diskStorage({
    destination: fileDirectory,
    filename(request, file, callback) {
      const filehash = crypto.randomBytes(8).toString('hex');
      const fileName = `${filehash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
