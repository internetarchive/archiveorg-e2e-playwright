import dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL ?? "https://archive.org",
  patronUser: {
    email: process.env.PATRON_EMAIL || '',
    password: process.env.PATRON_PASSWORD || ''
  },
  privUser: {
    email: process.env.ARCHIVE_EMAIL || '',
    password: process.env.ARCHIVE_PASSWORD || '',
  },
}
