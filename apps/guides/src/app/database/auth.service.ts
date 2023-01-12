import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { distinctUntilChanged, shareReplay, switchMap, tap } from 'rxjs/operators';
import { UsersService } from './user/users.service';
import { Observable, of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TeamcraftUser } from './user/teamcraft-user';
import { isPlatformBrowser } from '@angular/common';
import { Auth, authState, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<TeamcraftUser | null>;

  constructor(private auth: Auth,
              private usersService: UsersService,
              private message: NzMessageService,
              @Inject(PLATFORM_ID) private platform: Object) {
    if (isPlatformBrowser(platform)) {
      this.user$ = authState(this.auth).pipe(
        switchMap(user => {
          if (user) {
            return this.usersService.get(user.uid);
          }
          return of(null);
        }),
        distinctUntilChanged((a, b) => a?.$key === b?.$key),
        tap(user => {
          if (user && !user.admin && !user.moderator && !user.editor) {
            this.logout();
            this.message.error('Only editors and admins can log in to manage content.');
          }
        }),
        shareReplay(1)
      );
    } else {
      this.user$ = of(null);
    }
  }

  public logout(): void {
    signOut(this.auth);
  }
}
