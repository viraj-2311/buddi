const {
  REACT_APP_BASE_URL: BASE_URL,
  REACT_APP_S3_BUCKET_NAME: S3_BUCKET_NAME,
  REACT_APP_S3_BUCKET_REGION: S3_BUCKET_REGION,
  REACT_APP_S3_BUCKET_ACCESS_KEY_ID: S3_BUCKET_ACCESS_KEY_ID,
  REACT_APP_S3_BUCKET_SECRET_ACCESS_KEY: S3_BUCKET_SECRET_ACCESS_KEY,
  REACT_APP_OPEN_WEATHER_KEY,
  REACT_APP_OPEN_WEATHER_URL,
} = process.env;

export const baseUrl = BASE_URL;

// For staging
export const s3BucketConfig = {
  bucketName: S3_BUCKET_NAME,
  region: S3_BUCKET_REGION,
  accessKeyId: S3_BUCKET_ACCESS_KEY_ID,
  secretAccessKey: S3_BUCKET_SECRET_ACCESS_KEY,
};

export const maxFileUploadSize = 20 * 1024 * 1024;

export const openWeather = {
  key: REACT_APP_OPEN_WEATHER_KEY,
  url: REACT_APP_OPEN_WEATHER_URL,
};

export const plaidConfig = {
  clientName: 'Your app name',
  env: 'sandbox',
  product: ['auth', 'transactions'],
  publicKey: 'a8be5c063512cb15365c97ca7dc3f6',
};
