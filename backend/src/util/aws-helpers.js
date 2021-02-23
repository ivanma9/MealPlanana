import multerS3 from 'multer-s3';
import multer from 'multer';
import path from 'path';
import AWS from 'aws-sdk';
import {
  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
} from '../config';

// Check File Type
export const fileFilter = (req, file, cb) => {
  // Allowed ext
  const filetypes = /jpeg|jpg|png/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: Images Only!');
};

export const s3bucket = new AWS.S3({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_ACCESS_KEY,
  region: AWS_REGION,
});

export const upload = multer({
  fileFilter,
  limits: { fileSize: 10000000 },
  storage: multerS3({
    acl: 'public-read',
    s3: s3bucket,
    bucket: AWS_BUCKET_NAME,
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      // common practice to add Date.now() to make id/key unique
      cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
  }),
});

export const uploader = upload.fields(
  [
    {
      name: 'preview',
      maxCount: 1,
    },
    {
      name: 'images',
      maxCount: 5,
    },
  ],
);
