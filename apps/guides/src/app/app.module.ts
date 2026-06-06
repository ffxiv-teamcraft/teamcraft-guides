import { NgModule, SecurityContext } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { IconsProviderModule } from './icons-provider.module';
import { NzFooterComponent, NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { MarkdownModule } from 'ngx-markdown';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { CoreModule } from './core/core.module';
import { DatabaseModule } from './database/database.module';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { NzBadgeModule } from 'ng-zorro-antd/badge';

registerLocaleData(en);

@NgModule({
  declarations: [AppComponent],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    StoreModule.forRoot([]),
    EffectsModule.forRoot(),
    MarkdownModule.forRoot({
      sanitize: SecurityContext.NONE as any
    }),
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    IconsProviderModule,
    NzLayoutModule,
    NzMenuModule,
    !environment.production ? StoreDevtoolsModule.instrument({
      name: 'Teamcraft Guides',
      connectInZone: true
    }) : [],
    FlexLayoutModule,
    NzButtonModule,
    NzModalModule,
    CoreModule,
    DatabaseModule,
    NzTooltipModule,
    NzBadgeModule,
    NzFooterComponent
  ], providers: [{ provide: NZ_I18N, useValue: en_US }, provideHttpClient(withInterceptorsFromDi())]
})
export class AppModule {
}
