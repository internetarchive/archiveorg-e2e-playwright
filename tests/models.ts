export type DateMetadataLabel = {
  filter: string;
  date: string;
};

export type LayoutViewMode = 'tile' | 'list' | 'compact';

export enum LayoutViewModeLocator {
  TILE = '#grid-button',
  LIST = '#list-detail-button',
  COMPACT = '#list-compact-button',
}

export enum SearchOption {
  METADATA = `Search metadata`,
  TEXT = `Search text contents`,
  TV = `Search TV news captions`,
  RADIO = `Search radio transcripts`,
  WEB = `Search archived web sites`,
}

export type SortFilter =
  | 'Weekly views'
  | 'All-time views'
  | 'Title'
  | 'Date published'
  | 'Date archived'
  | 'Date reviewed'
  | 'Date added'
  | 'Creator';

export type SortOrder = 'ascending' | 'descending';

export const SortFilterURL = {
  'Weekly views': 'week',
  'All-time views': 'downloads',
  Title: 'title',
  'Date published': 'date',
  'Date archived': 'publicdate',
  'Date reviewed': 'reviewdate',
  'Date added': 'addeddate',
  Creator: 'creator',
};

export enum FacetGroupLocatorLabel {
  DATE = 'date-picker-label',
  MEDIATYPE = 'facet-group-header-label-mediatype',
  LENDING = 'facet-group-header-label-lending',
  YEAR = 'facet-group-header-label-year',
  SUBJECT = 'facet-group-header-label-subject',
  COLLECTION = 'facet-group-header-label-collection',
  CREATOR = 'facet-group-header-label-creator',
  LANGUAGE = 'facet-group-header-label-language',
}

export type FacetType = 'positive' | 'negative';

export type ViewFacetMetadata =
  | 'tile-collection-icontitle'
  | 'tile-icontitle'
  | 'list-date';

export type BookPageViewMode = '1up' | '2up' | 'thumb';

export type ChannelSelector = 'Player' | 'Webamp';

export type UserType = 'privs' | 'patron' | 'no-login';

export type PageType = 'radio' | 'tv';

export enum FacetGroupFilterHeaderEnum {
  YEAR_PUBLISHED = 'Year Published range filter',
  MEDIATYPE = 'Media Type filters',
  YEAR = 'Year filters',
  SUBJECT = 'Subject filters',
  COLLECTION = 'Collection filters',
  CREATOR = 'Creator filters',
  LANGUAGE = 'Language filters',
  AVAILABILITY = 'Availability filters',
  PART_OF = 'Part Of', // this only appears in collection page
}

export const CommonFacetGroupHeaders = [
  FacetGroupFilterHeaderEnum.YEAR_PUBLISHED,
  FacetGroupFilterHeaderEnum.MEDIATYPE,
  FacetGroupFilterHeaderEnum.YEAR,
  FacetGroupFilterHeaderEnum.SUBJECT,
  FacetGroupFilterHeaderEnum.COLLECTION,
  FacetGroupFilterHeaderEnum.CREATOR,
  FacetGroupFilterHeaderEnum.LANGUAGE,
];

export const SearchFacetGroupHeader = [
  ...CommonFacetGroupHeaders,
  FacetGroupFilterHeaderEnum.AVAILABILITY,
];

export const CollectionFacetGroupHeader = [
  ...CommonFacetGroupHeaders,
  FacetGroupFilterHeaderEnum.PART_OF,
];