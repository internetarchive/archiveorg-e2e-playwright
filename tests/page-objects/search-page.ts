import { type Page } from '@playwright/test';

import { CollectionBrowser } from './collection-browser';
import { CollectionFacets } from './collection-facets';
import { CollectionSearchInput } from './collection-search-input';
import { InfiniteScroller } from './infinite-scroller';
import { SortBar } from './sort-bar';

import { pageIdentifiers } from '../identifiers';
const { search } = pageIdentifiers;

export class SearchPage {
  readonly page: Page;

  readonly collectionBrowser: CollectionBrowser;
  readonly collectionFacets: CollectionFacets;
  readonly collectionSearchInput: CollectionSearchInput;
  readonly infiniteScroller: InfiniteScroller;
  readonly sortBar: SortBar;

  public constructor(page: Page) {
    this.page = page;

    this.collectionBrowser = new CollectionBrowser(this.page);
    this.collectionFacets = new CollectionFacets(this.page);
    this.collectionSearchInput = new CollectionSearchInput(this.page);
    this.infiniteScroller = new InfiniteScroller(this.page);
    this.sortBar = new SortBar(this.page);
  }

  async visit() {
    await this.page.goto(search.url);
  }

  async goBackToSearchPage() {
    await this.visit();
  }
}