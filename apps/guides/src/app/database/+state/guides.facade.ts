import { Injectable } from '@angular/core';

import { select, Store } from '@ngrx/store';

import * as GuidesActions from './guides.actions';
import * as GuidesSelectors from './guides.selectors';
import { Guide } from './guide';

@Injectable()
export class GuidesFacade {
  /**
   * Combine pieces of state using createSelector,
   * and expose them as observables through the facade.
   */
  allGuides$ = this.store.pipe(select(GuidesSelectors.getAllGuides));
  selectedGuides$ = this.store.pipe(select(GuidesSelectors.getSelected));

  constructor(private store: Store) {
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
