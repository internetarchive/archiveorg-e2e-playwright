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
}

export const identifier = {
  books: {
    default: '/details/theworksofplato01platiala'
  },
  details: {
    default: '/details/theworksofplato01platiala'
  },
  home: {
   default:  '/'
  },
  collection: {
    default: 'oldtimeradio'
  },
  profile: {
    default: 'brewster'
  },
  search: {
    default: '/search'
  },
  profileUploads: {
    default: 'brewster/uploads'
  },
};
