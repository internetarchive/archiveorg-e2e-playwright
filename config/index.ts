import dotenv from 'dotenv';
dotenv.config();

export const config = {
  baseURL: process.env.BASE_URL ?? "https://archive.org",
  patronUser: {
    email: process.env.ARCHIVE_EMAIL || '',
    password: process.env.ARCHIVE_PASSWORD || ''
  },
  privUser: {
    email: process.env.PATRON_EMAIL || '',
    password: process.env.PATRON_PASSWORD || '',
  },
}

export const identifier = {
  about: {
    url: '/about',
    jobs: '/about/jobs.php',
    terms: '/about/terms.php',
    news: '/about/news-stories'
  },
  av: {
    url: '',
    default: '/details/CSPAN_20160425_022500_2011_White_House_Correspondents_Dinner'
  },
  accountSettings: {
    url: '/account/index.php?settings=1',
    default: '',
  },
  books: {
    url: '/details',
    default: '/details/theworksofplato01platiala',
  },
  lending: {
    chromium: 'hitrun0000haro',
    firefox: 'cornellstudiesin26unse',
    webkit: 'annualreport0000meth_x3r2'
  },
  details: {
    url: '/details',
    default: 'goody',
    bookreader: 'goody',
    three_d_viewer: 'smarthouseplus-v1.0',
    audio_image_carousel: '78_yogi-bear-introduces-loopy-de-loop-and-lets-have-a-song-yogi-bear_sascha-burland-do_gbia0534535',
    audio_single_image_1: '78_house-of-the-rising-sun_josh-white-and-his-guitar_gbia0001628b',
    audio_single_image_2: 'OTRR_Philip_Marlowe_Singles', 
    archive_data: 'ARCHIVEIT-12737-DAILY-JOB1254458-SEED2061041-20200803-00000',
    software_emulation: 'msdos_Oregon_Trail_The_1990',
    image_carousel: 'img-0855_202106',
    image_single: 'mma_albert_einstein_270714',
    radio_borrow: 'WGBH_89_7_FM_20210918_040000',
    tv_borrow: 'CSPAN3_20170413_154200_Discussion_Focuses_on_Sesame_Street_and_Autism',
    theater_video: '0872_Angels_Flight_05_32_34_00',
    webamp: 'OTRR_Philip_Marlowe_Singles',
    webamp_with_skin: 'winampskin_Tundra_Winamp_Skin_Actualized',
  },
  home: {
    url: '/',
    default:  '/',
  },
  collection: {
    url: '',
    default: 'oldtimeradio',
  },
  login: {
    url: '/account/login',
    default: '',
  },
  profile: {
    url: '',
    default: 'brewster',
  },
  profileUploads: {
    url: '',
    default: 'brewster/uploads',
  },
  search: {
    url: '',
    default: '/search',
  },
};
