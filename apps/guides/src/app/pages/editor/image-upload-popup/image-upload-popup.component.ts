import { Component } from '@angular/core';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadXHRArgs } from 'ng-zorro-antd/upload/interface';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { combineLatest, from } from 'rxjs';
import { first } from 'rxjs/operators';
import { deleteObject, getDownloadURL, percentage, ref, Storage } from '@angular/fire/storage';
import { uploadBytesResumable } from '@firebase/storage';

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
  styleUrls: ['./image-upload-popup.component.less']
})
export class ImageUploadPopupComponent {

  fileList: NzUploadFile[] = [];

  previewImage: string | undefined = '';
  previewVisible = false;

  constructor(private storage: Storage, private modalRef: NzModalRef) {
  }

  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  upload = (args: NzUploadXHRArgs) => {
    const fileRef = ref(this.storage, this.getFilePath(args.file));
    const task = uploadBytesResumable(fileRef, args.postFile as File);
    return percentage(task)
      .subscribe({
        next: percent => args.onProgress({ percent }, args.file),
        error: err => args.onError(err, args.file),
        complete: () => args.onSuccess(true, args.file, null)
      });
  };

  remove = (file: NzUploadFile) => {
    return from(deleteObject(ref(this.storage, this.getFilePath(file))));
  };

  private getFilePath(file: NzUploadFile): string {
    return `guides/${file.uid}-${file.name}`;
  }

  importImages(): void {
    combineLatest(this.fileList.map(file => getDownloadURL(ref(this.storage, this.getFilePath(file))))).pipe(
      first()
    ).subscribe(urls => this.modalRef.close(urls));
  }

  cancel(): void {
    this.modalRef.close([]);
  }

}
