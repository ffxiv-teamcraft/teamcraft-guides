import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { NzCodeEditorModule } from 'ng-zorro-antd/code-editor';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CoreModule } from '../../core/core.module';
import { DatabaseModule } from '../../database/database.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';

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
    DatabaseModule,
    FlexLayoutModule,

    RouterModule.forChild(routes),
    NzTabsModule,
    CoreModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule
  ]
})
export class EditorModule {
}
