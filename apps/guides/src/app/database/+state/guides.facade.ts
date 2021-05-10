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
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  allGuides$ = combineLatest([
    this.store.pipe(select(GuidesSelectors.getAllGuides)),
    this.store.pipe(select(GuidesSelectors.getLoaded))
  ]).pipe(
    filter(([, loaded]) => loaded),
    map(([guides]) => guides),
    firstIfServer(this.platform)
  );
  selectedGuides$ = this.store.pipe(select(GuidesSelectors.getSelected)).pipe(
    filter(guide => guide !== undefined),
    firstIfServer(this.platform)
  );

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
  }
}
