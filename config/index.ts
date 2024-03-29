import dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL ?? "https://archive.org",
  patronUser: {
    email: process.env.B_EMAIL || '',
    password: process.env.B_PASSWORD || ''
  },
  privUser: {
    email: process.env.A_EMAIL || '',
    password: process.env.A_PASSWORD || '',
  },
  authFile: {
    patron: 'playwright/.auth/patron-user.json',
    privs: 'playwright/.auth/priv-user.json',
  }
}
