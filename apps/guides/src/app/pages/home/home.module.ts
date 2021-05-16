import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzCardModule } from 'ng-zorro-antd/card';
import { CoreModule } from '../../core/core.module';
import { NzDividerModule } from 'ng-zorro-antd/divider';

@NgModule({
  declarations: [
    HomeComponent
  ],
  exports: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    NzCarouselModule,
    NzSpinModule,
    NzCardModule,
    CoreModule,
    NzDividerModule
  ]
})
export class HomeModule {
}
