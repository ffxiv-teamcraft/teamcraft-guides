import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { CoreModule } from './core/core.module';
import { XivapiClientModule } from '@xivapi/angular-client';
import { DatabaseModule } from './database/database.module';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { AngularFireStorageModule } from '@angular/fire/storage';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'teamcraft-guides' }),

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,

    StoreModule.forRoot([]),
    EffectsModule.forRoot(),

    XivapiClientModule.forRoot(),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE
    }),
    FormsModule,
    ReactiveFormsModule,
    NzMessageModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    !environment.production ? StoreDevtoolsModule.instrument({
      name: 'Teamcraft Guides'
    }) : [],
    FlexLayoutModule,
    NzButtonModule,
    NzModalModule,
    CoreModule,
    DatabaseModule,
    NzToolTipModule
  ],
  providers: [{ provide: NZ_I18N, useValue: en_US }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
