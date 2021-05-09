import { createAction, props } from '@ngrx/store';
import { Guide } from './model/guide';

export const init = createAction('[Guides Page] Init');

export const loadGuidesSuccess = createAction(
  '[Guides/API] Load Guides Success',
  props<{ guides: Guide[] }>()
);

export const selectGuide = createAction(
  '[Guides/API] Select Guide',
  props<{ key: string }>()
);

export const saveGuide = createAction(
  '[Guides/API] Save Guide',
  props<{ guide: Guide }>()
);

export const loadGuide = createAction(
  '[Guides/API] Load Guide',
  props<{ key: string }>()
);

export const loadGuideSuccess = createAction(
  '[Guides/API] Load Guide Success',
  props<{ guide: Guide }>()
);
