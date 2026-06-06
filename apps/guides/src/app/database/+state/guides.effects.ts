import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as GuidesActions from './guides.actions';
import { GuidesService } from '../guides/guides.service';
import { map, switchMap, switchMapTo, tap, withLatestFrom } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../auth.service';

@Injectable()
export class GuidesEffects {
  private actions$ = inject(Actions);
  private guidesService = inject(GuidesService);
  private message = inject(NzMessageService);
  private authService = inject(AuthService);

  loadGuides$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GuidesActions.init),
      switchMapTo(this.authService.user$),
      switchMap((user) => {
        if (user) {
          return this.guidesService.getAll();
        } else {
          return this.guidesService.getAll(ref => ref.where('published', '==', true));
        }
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
      withLatestFrom(this.authService.user$),
      switchMap(([{ guide }, user]) => {
        if (!guide.author) {
          guide = { ...guide, author: user.$key };
        }
        return this.guidesService.save(guide).pipe(
          map(() => GuidesActions.loadGuide({ key: guide.slug }))
        );
      }),
      tap(() => this.message.success('Guide saved'))
    )
  );

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }
}
