import { NgModule } from '@angular/core';
import { NZ_ICONS, NzIconModule } from 'ng-zorro-antd/icon';

import {
  AppstoreAddOutline,
  DashboardOutline,
  DisconnectOutline,
  DownOutline,
  EditOutline,
  FileImageOutline,
  FormOutline,
  HomeOutline,
  IdcardOutline,
  MenuFoldOutline,
  MenuUnfoldOutline,
  PlusOutline,
  RightOutline,
  SaveOutline,
  ShareAltOutline,
  UnorderedListOutline
} from '@ant-design/icons-angular/icons';

const icons = [MenuFoldOutline, MenuUnfoldOutline, DashboardOutline, FormOutline, SaveOutline, EditOutline, DisconnectOutline, HomeOutline,
  PlusOutline, FileImageOutline, UnorderedListOutline, AppstoreAddOutline, ShareAltOutline,
  RightOutline, DownOutline, IdcardOutline];

@NgModule({
  imports: [NzIconModule],
  exports: [NzIconModule],
  providers: [
    { provide: NZ_ICONS, useValue: icons }
  ]
})
export class IconsProviderModule {
}
