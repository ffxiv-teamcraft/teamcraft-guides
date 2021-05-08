import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GuideContentComponent } from './guide-content/guide-content.component';
import { DYNAMIC_COMPONENTS } from './dynamic-html/dynamic-component';
import { ActionComponent } from './custom-markdown-elements/action/action.component';
import { DynamicHTMLRenderer } from './dynamic-html/dynamic-html-renderer';

@NgModule({
  declarations: [GuideContentComponent, ActionComponent],
  exports: [GuideContentComponent],
  imports: [
    CommonModule,

    HttpClientModule
  ],
  providers: [
    {
      provide: DYNAMIC_COMPONENTS,
      useValue: { selector: 'action', component: ActionComponent },
      multi: true
    },
    DynamicHTMLRenderer
  ]
})
export class CoreModule {
}
