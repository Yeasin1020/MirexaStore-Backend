import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

const requiredEnvVariables = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'BCRYPT_SALT_ROUNDS',
  'JWT_ACCESS_SECRET',
  'JWT_ACCESS_EXPIRES_IN',
  'JWT_REFRESH_SECRET',
  'JWT_REFRESH_EXPIRES_IN',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GOOGLE_CALLBACK_URL',
  'SESSION_SECRET',
  'SSLCommerzSandbox',
  'SSLCommerzStorePassword',
  'SSLCommerzStoreId',
  'DOMAIN_URL',
];

requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});

export default {
  NODE_ENV: process.env.NODE_ENV!,
  port: process.env.PORT!,
  database_url: process.env.DATABASE_URL!,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS!,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET!,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
  google_client_id: process.env.GOOGLE_CLIENT_ID!,
  google_client_secret: process.env.GOOGLE_CLIENT_SECRET!,
  google_callback_url: process.env.GOOGLE_CALLBACK_URL!,
  session_secret: process.env.SESSION_SECRET!,
  sslcommerz: {
    sandbox: process.env.SSLCommerzSandbox === 'true',
    store_id: process.env.SSLCommerzStoreId!,
    store_password: process.env.SSLCommerzStorePassword!,
  },
  domain_url: process.env.DOMAIN_URL!,
};
