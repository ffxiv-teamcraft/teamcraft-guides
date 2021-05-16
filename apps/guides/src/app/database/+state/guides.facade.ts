import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { firstIfServer } from '../../core/rxjs/first-if-server';

import * as GuidesActions from './guides.actions';
import * as GuidesSelectors from './guides.selectors';
import { Guide } from './model/guide';

@Injectable()
export class GuidesFacade {

  loading$ = this.store.pipe(
    select(GuidesSelectors.getLoaded),
    map(loaded => !loaded),
    firstIfServer(this.platform)
  );

  allGuides$ = combineLatest([
    this.store.pipe(select(GuidesSelectors.getAllGuides)),
    this.store.pipe(select(GuidesSelectors.getLoaded))
  ]).pipe(
    filter(([, loaded]) => loaded),
    map(([guides]) => guides.map(guide => {
      let ribbon: string = null;
      if (guide.published) {
        // New guide if it has been created less than a week ago
        const isNew = (Date.now() - guide.publishDate) < 86_400_000 * 7;
        // Updated if it has been updated less than a week ago
        const isUpdated = (Date.now() - guide.updated) < 86_400_000 * 7;
        if (isNew) {
          ribbon = 'New !';
        } else if (isUpdated) {
          ribbon = 'Updated !';
        }
      }
      return {
        ...guide,
        ribbon
      };
    })),
    firstIfServer(this.platform)
  );

  selectedGuides$ = this.store.pipe(select(GuidesSelectors.getSelected)).pipe(
    filter(guide => guide !== undefined),
    firstIfServer(this.platform)
  );

  dirty = false;

  constructor(private store: Store,
              @Inject(PLATFORM_ID) private platform: Object) {
  }

  /**
   * Use the initialization action to perform one
   * or more tasks in your Effects.
   */
  init(): void {
    this.store.dispatch(GuidesActions.init());
  }

  select(key: string): void {
    this.store.dispatch(GuidesActions.selectGuide({ key }));
  }

  save(guide: Guide): void {
    this.store.dispatch(GuidesActions.saveGuide({ guide }));
    this.dirty = false;
  }
}
