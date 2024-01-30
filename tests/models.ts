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
