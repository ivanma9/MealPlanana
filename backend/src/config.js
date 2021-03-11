const dotenv = require('dotenv');

dotenv.config();

export const {
  PORT,
  NODE_ENV,

  MONGO_URI,

  SESS_NAME,
  SESS_SECRET,
  SESS_LIFETIME,

  AWS_BUCKET_NAME,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_Uploaded_File_URL_LINK,
} = process.env;
