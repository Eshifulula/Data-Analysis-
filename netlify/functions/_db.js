import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is required');
}

export const sql = neon(process.env.DATABASE_URL);

export const json = (statusCode, data, extraHeaders = {}) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    ...extraHeaders
  },
  body: JSON.stringify(data)
});

export const parseBody = (event) => {
  try {
    return JSON.parse(event.body || '{}');
  } catch {
    return null;
  }
};
