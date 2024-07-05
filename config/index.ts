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
  accountSettings: {
    url: '/account/index.php?settings=1',
  },
  books: {
    url: '/details',
    default: '/details/theworksofplato01platiala'
  },
  details: {
    url: '/details',
    default: '/details/theworksofplato01platiala'
  },
  home: {
    url: '/',
    default:  '/'
  },
  collection: {
    url: '',
    default: 'oldtimeradio'
  },
  login: {
    url: '/account/login',
    default: '',
  },
  profile: {
    url: '',
    default: 'brewster'
  },
  search: {
    url: '',
    default: '/search'
  },
  profileUploads: {
    url: '',
    default: 'brewster/uploads'
  },
};
