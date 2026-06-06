import { Injectable, PLATFORM_ID, inject } from '@angular/core';

import { select, Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { firstIfServer } from '../../core/rxjs/first-if-server';

import * as GuidesActions from './guides.actions';
import * as GuidesSelectors from './guides.selectors';
import { Guide } from './model/guide';

@Injectable()
export class GuidesFacade {
  private store = inject(Store);
  private platform = inject<Object>(PLATFORM_ID);


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
    map(([guides]) => guides),
    firstIfServer(this.platform)
  );

  featuredGuides$ = this.allGuides$.pipe(
    map(guides => guides.filter(guide => guide.featured))
  )

  selectedGuides$ = this.store.pipe(select(GuidesSelectors.getSelected)).pipe(
    filter(guide => guide !== undefined),
    firstIfServer(this.platform)
  );

  dirty = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
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
