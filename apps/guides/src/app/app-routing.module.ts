import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { map } from 'rxjs/operators';
import { canActivate } from '@angular/fire/auth-guard';

const redirectToHomeIfNotLoggedIn = () => map(user => user ? true : ['home']);

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/home' },
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) },
  { path: 'guide', loadChildren: () => import('./pages/guide/guide.module').then(m => m.GuideModule) },
  {
    path: 'editor',
    loadChildren: () => import('./pages/editor/editor.module').then(m => m.EditorModule),
    ...canActivate(redirectToHomeIfNotLoggedIn)
  },
  { path: '**', pathMatch: 'full', redirectTo: '/home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    initialNavigation: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
