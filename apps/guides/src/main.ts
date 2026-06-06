import { enableProdMode, importProvidersFrom, SecurityContext } from '@angular/core';


import { environment } from './environments/environment';
import { en_US, NZ_I18N } from 'ng-zorro-antd/i18n';
import { bootstrapApplication, BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule, provideEffects } from '@ngrx/effects';
import { MarkdownModule, provideMarkdown } from 'ngx-markdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app-routing.module';
import { IconsProviderModule } from './app/icons-provider.module';
import { NzFooterComponent, NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { CoreModule } from './app/core/core.module';
import { DatabaseModule } from './app/database/database.module';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { AppComponent } from './app/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

if (environment.production) {
  enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
  bootstrapApplication(AppComponent, {
    providers: [
      // provideMarkdown({
      //   sanitize: SecurityContext.NONE as any
      // }),
      provideStore(),
      provideEffects(),

      importProvidersFrom(BrowserModule, AngularFireModule.initializeApp(environment.firebase), AngularFirestoreModule, AngularFireAuthModule, AngularFireStorageModule,
        FormsModule, ReactiveFormsModule, BrowserAnimationsModule, AppRoutingModule, IconsProviderModule, NzLayoutModule, NzMenuModule, !environment.production ? StoreDevtoolsModule.instrument({
          name: 'Teamcraft Guides',
          connectInZone: true
        }) : [], FlexLayoutModule, NzButtonModule, NzModalModule, CoreModule, DatabaseModule, NzTooltipModule, NzBadgeModule),
      { provide: NZ_I18N, useValue: en_US },
      provideHttpClient(withInterceptorsFromDi())
    ]
  });
});
