const ABOUT_URL = '/about';
const DETAILS_URL = '/details';
const HOME_URL = '/';
const SEARCH_URL = '/search';

export const pageIdentifiers = {
  about: {
    url: ABOUT_URL,
    page: {
      jobs: `${ABOUT_URL}/jobs.php`,
      terms: `${ABOUT_URL}/terms.php`,
      news: `${ABOUT_URL}/news-stories`
    }
  },
  accountSettings: {
    url: '/account/index.php?settings=1',
  },
  details: {
    url: `${DETAILS_URL}`,
    item: {
      oldtimeradio: `${DETAILS_URL}/oldtimeradio`,
      plato: `${DETAILS_URL}/theworksofplato01platiala`,
      billie_holiday: `78_when-a-woman-loves-a-man_billie-holiday-and-her-orchestra-billie-holiday-buck-clayt_gbia0031202`,
      whitehouse: `${DETAILS_URL}/CSPAN_20160425_022500_2011_White_House_Correspondents_Dinner`
    }
  },
  home: {
    url: HOME_URL,
  },
  collection: {
    url: `${DETAILS_URL}`,
    item: {
      oldtimeradio: `${DETAILS_URL}/oldtimeradio`,
    }
  },
  login: {
    url: '/account/login'
  },
  profile: {
    url: '',
    item: {
      brewster: 'brewster',
      brewsterUploads: 'brewster/uploads'
    }
  },
  search: {
    url: `${SEARCH_URL}/?ab_config=EagerFacets:On`, // facets loaded without accordion
    item: {
      cats: ''
    }
  },

};
