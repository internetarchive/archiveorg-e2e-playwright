export type DateMetadataLabel = {
  filter: string;
  date: string;
};

export type LayoutViewMode = 'tile' | 'list' | 'compact';

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

export enum FacetGroupSelectorLabel {
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

export type ViewFacetGroup = 'tile-title' | 'list-date';
