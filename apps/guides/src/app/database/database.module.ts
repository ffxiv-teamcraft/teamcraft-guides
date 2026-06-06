import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { provideStore } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromGuides from './+state/guides.reducer';
import { GuidesEffects } from './+state/guides.effects';
import { GuidesFacade } from './+state/guides.facade';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    provideStore({ [fromGuides.GUIDES_FEATURE_KEY]: fromGuides.reducer }),
    EffectsModule.forFeature([GuidesEffects])
  ],
  providers: [GuidesFacade]
})
export class DatabaseModule {
}
