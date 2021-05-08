import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CoreModule } from '../../core/core.module';

const routes: Routes = [
  {
    path: ':slug',
    component: EditorComponent
  },
  {
    path: '',
    component: EditorComponent
  }
];

@NgModule({
  declarations: [
    EditorComponent
  ],
  imports: [
    CommonModule,
    NzCodeEditorModule,
    FormsModule,

    RouterModule.forChild(routes),
    NzTabsModule,
    CoreModule
  ]
})
export class EditorModule {
}
