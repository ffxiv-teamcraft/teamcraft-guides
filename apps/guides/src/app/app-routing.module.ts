import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs/operators';
import { canActivate } from '@angular/fire/auth-guard';
import { HomeModule } from './pages/home/home.module';
import { HomeComponent } from './pages/home/home/home.component';

const redirectToHomeIfNotLoggedIn = () => map(user => user ? true : ['home']);

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'guide', loadChildren: () => import('./pages/guide/guide.module').then(m => m.GuideModule) },
  {
    path: 'editor',
    loadChildren: () => import('./pages/editor/editor.module').then(m => m.EditorModule),
    ...canActivate(redirectToHomeIfNotLoggedIn)
  },
  { path: '**', pathMatch: 'full', redirectTo: '' }
];

@NgModule({
  imports: [
    HomeModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
