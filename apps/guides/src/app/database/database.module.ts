import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as fromGuides from './+state/guides.reducer';
import { GuidesEffects } from './+state/guides.effects';
import { GuidesFacade } from './+state/guides.facade';
import { NzMessageModule } from 'ng-zorro-antd/message';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(fromGuides.GUIDES_FEATURE_KEY, fromGuides.reducer),
    EffectsModule.forFeature([GuidesEffects]),
    NzMessageModule
  ],
  providers: [GuidesFacade]
})
export class DatabaseModule {
}
