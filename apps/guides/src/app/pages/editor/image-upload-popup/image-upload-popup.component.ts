import { Component, inject } from '@angular/core';
import { NzUploadFile, NzUploadComponent } from 'ng-zorro-antd/upload';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { NzUploadXHRArgs } from 'ng-zorro-antd/upload';
import { NzModalRef, NzModalComponent } from 'ng-zorro-antd/modal';
import { combineLatest } from 'rxjs';
import { first, mapTo } from 'rxjs/operators';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NgStyle } from '@angular/common';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { FlexModule } from '@angular/flex-layout/flex';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

@Component({
    selector: 'guides-image-upload-popup',
    templateUrl: './image-upload-popup.component.html',
    styleUrls: ['./image-upload-popup.component.less'],
    imports: [NzUploadComponent, ɵNzTransitionPatchDirective, NzIconDirective, NzModalComponent, NgStyle, ExtendedModule, FlexModule, NzSpaceCompactItemDirective, NzButtonComponent, NzWaveDirective]
})
export class ImageUploadPopupComponent {
  private afs = inject(AngularFireStorage);
  private modalRef = inject(NzModalRef);


  fileList: NzUploadFile[] = [];

  previewImage: string | undefined = '';
  previewVisible = false;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  upload = (args: NzUploadXHRArgs) => {
    return this.afs.upload(this.getFilePath(args.file), args.postFile)
      .percentageChanges()
      .subscribe({
        next: percent => args.onProgress({ percent }, args.file),
        error: err => args.onError(err, args.file),
        complete: () => args.onSuccess(true, args.file, null)
      });
  };

  remove = (file: NzUploadFile) => {
    return this.afs.ref(this.getFilePath(file)).delete().pipe(
      mapTo(true)
    );
  };

  private getFilePath(file: NzUploadFile): string {
    return `guides/${file.uid}-${file.name}`;
  }

  importImages(): void {
    combineLatest(this.fileList.map(file => this.afs.ref(this.getFilePath(file)).getDownloadURL())).pipe(
      first()
    ).subscribe(urls => this.modalRef.close(urls));
  }

  cancel(): void {
    this.modalRef.close([]);
  }

}
