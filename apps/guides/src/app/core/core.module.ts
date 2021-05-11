import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { GuideContentComponent } from './guide-content/guide-content.component';
import { DYNAMIC_COMPONENTS, DynamicComponent } from './dynamic-html/dynamic-component';
import { ActionComponent } from './custom-markdown-elements/action/action.component';
import { DynamicHTMLRenderer } from './dynamic-html/dynamic-html-renderer';
import { LoginPopupComponent } from './login-popup/login-popup.component';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { ReactiveFormsModule } from '@angular/forms';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CharacterPipe } from './pipes/character.pipe';
import { XivapiClientModule } from '@xivapi/angular-client';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

@NgModule({
  declarations: [GuideContentComponent, ActionComponent, LoginPopupComponent, CharacterPipe],
  exports: [GuideContentComponent, LoginPopupComponent, CharacterPipe],
  imports: [
    CommonModule,

    HttpClientModule,
    NzAlertModule,
    NzDividerModule,
    NzButtonModule,
    NzFormModule,
    ReactiveFormsModule,
    NzInputModule,
    XivapiClientModule,
    NzToolTipModule
  ],
  providers: [
    {
      provide: DYNAMIC_COMPONENTS,
      useValue: {
        selector: 'action',
        component: ActionComponent,
        contentLoader: 'getActions',
        getId: args => +args[0]
      } as DynamicComponent,
      multi: true
    },
    DynamicHTMLRenderer
  ]
})
export class CoreModule {
}
