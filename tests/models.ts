export type DateMetadataLabel = {
  filter: string,
  date: string
}

export type LayoutViewMode = 'tile' | 'list' | 'compact';

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
