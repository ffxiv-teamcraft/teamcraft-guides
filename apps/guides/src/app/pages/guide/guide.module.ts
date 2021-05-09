import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GuideComponent } from './guide/guide.component';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '../../core/core.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DatabaseModule } from '../../database/database.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

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
    DatabaseModule,

    RouterModule.forChild(routes),
    CoreModule,
    FlexLayoutModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzSpinModule,
    NzEmptyModule
  ]
})
export class GuideModule {
}
