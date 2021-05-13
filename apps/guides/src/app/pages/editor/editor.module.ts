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
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { ImageUploadPopupComponent } from './image-upload-popup/image-upload-popup.component';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { DirtyGuard } from './dirty.guard';
import { GuideContributorGuard } from './guide-contributor.guard';

const routes: Routes = [
  {
    path: ':slug',
    component: EditorComponent,
    canDeactivate: [DirtyGuard],
    canActivate: [GuideContributorGuard]
  },
  {
    path: '',
    component: EditorComponent,
    canDeactivate: [DirtyGuard]
  }
];

@NgModule({
  declarations: [
    EditorComponent,
    ImageUploadPopupComponent
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
    NzInputModule,
    NzSelectModule,
    NzCheckboxModule,
    NzCardModule,
    NzSwitchModule,
    NzModalModule,
    NzUploadModule
  ],
  providers: [
    DirtyGuard,
    GuideContributorGuard
  ]
})
export class EditorModule {
}
