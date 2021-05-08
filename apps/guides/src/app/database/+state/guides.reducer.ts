import { Action, createReducer, on } from '@ngrx/store';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';

import * as GuidesActions from './guides.actions';
import { Guide } from './guide';

export const GUIDES_FEATURE_KEY = 'guides';

export interface State extends EntityState<Guide> {
  selectedId?: string; // which Guides record has been selected
}

export interface GuidesPartialState {
  readonly [GUIDES_FEATURE_KEY]: State;
}

export const guidesAdapter: EntityAdapter<Guide> = createEntityAdapter<Guide>({
  selectId: model => model.slug
});

export const initialState: State = guidesAdapter.getInitialState({
  // set initial required properties
  loaded: false
});

const guidesReducer = createReducer(
  initialState,
  on(GuidesActions.init, (state) => ({ ...state, loaded: false, error: null })),
  on(GuidesActions.loadGuidesSuccess, (state, { guides }) =>
    guidesAdapter.setAll(guides, { ...state, loaded: true })
  ),
  on(GuidesActions.loadGuideSuccess, (state, { guide }) =>
    guidesAdapter.setOne(guide, { ...state })
  ),
  on(GuidesActions.selectGuide, (state, { key }) =>
    ({ ...state, selectedId: key })
  )
);

export function reducer(state: State | undefined, action: Action) {
  return guidesReducer(state, action);
}
