import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { switchMap, tap } from 'rxjs/operators';
import { UsersService } from './user/users.service';
import { Observable, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TeamcraftUser } from './user/teamcraft-user';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<TeamcraftUser | null>;

  constructor(private af: AngularFireAuth,
              private usersService: UsersService,
              private message: NzMessageService,
              @Inject(PLATFORM_ID) private platform: Object) {
    if (isPlatformBrowser(platform)) {
      this.user$ = this.af.authState.pipe(
        switchMap(user => {
          if (user) {
            return this.usersService.get(user.uid);
          }
          return of(null);
        }),
        tap(user => {
          if (user && !user.admin && !user.editor) {
            this.logout();
            this.message.error('Only editors and admins can log in to manage content.');
          }
        })
      );
    } else {
      this.user$ = of(null);
    }
  }

  public logout(): void {
    this.af.signOut();
  }
}
