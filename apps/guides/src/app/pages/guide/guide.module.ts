import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideComponent } from './guide/guide.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../core/core.module';

const routes: Routes = [{
  path: ':slug',
  component: GuideComponent
}];

@NgModule({
  declarations: [
    GuideComponent
  ],
  imports: [
    CommonModule,

    RouterModule.forChild(routes),
    CoreModule
  ]
})
export class GuideModule {
}
