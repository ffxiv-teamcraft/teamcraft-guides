import { CanDeactivate } from '@angular/router';
import { Injectable } from '@angular/core';
import { GuidesFacade } from '../../database/+state/guides.facade';
import { Observable, of, Subject } from 'rxjs';
import { NzModalService } from 'ng-zorro-antd/modal';
import { tap } from 'rxjs/operators';


@Injectable()
export class DirtyGuard implements CanDeactivate<any> {

  constructor(private guidesFacade: GuidesFacade, private dialog: NzModalService) {
  }

  canDeactivate(): Observable<boolean> {
    if (!this.guidesFacade.dirty) {
      return of(true);
    } else {
      const result$ = new Subject<boolean>();
      this.dialog.confirm({
        nzTitle: 'Are you sure you want to leave?',
        nzContent: 'You have some unsaved changed',
        nzCancelText: 'No',
        nzOkText: 'Yes',
        nzOnOk: () => result$.next(true),
        nzOnCancel: () => result$.next(false)
      });
      return result$.pipe(
        tap(res => {
          this.guidesFacade.dirty = false;
        }));
    }
  }

}
