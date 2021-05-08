import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GuidesActions from './guides.actions';
import { GuidesService } from '../guides/guides.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';

@Injectable()
export class GuidesEffects {
  loadGuides$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidesActions.init),
      switchMap(() => {
        return this.guidesService.getAll();
      }),
      map(guides => GuidesActions.loadGuidesSuccess({ guides }))
    )
  );

  loadGuide$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidesActions.loadGuide),
      switchMap(({ key }) => {
        return this.guidesService.get(key);
      }),
      map(guide => GuidesActions.loadGuideSuccess({ guide }))
    )
  );

  saveGuide$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidesActions.saveGuide),
      switchMap(({ guide }) => {
        return this.guidesService.save(guide).pipe(
          map(() => GuidesActions.loadGuide({ key: guide.$key }))
        );
      }),
      tap(() => this.message.success('Guide saved'))
    )
  );

  constructor(private actions$: Actions, private guidesService: GuidesService,
              private message: NzMessageService) {
  }
}
