import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { switchMap, tap } from 'rxjs/operators';
import { UsersService } from './user/users.service';
import { of } from 'rxjs';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TeamcraftUser } from './user/teamcraft-user';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$: Observable<TeamcraftUser | null> = this.af.authState.pipe(
    switchMap(user => {
      if (user) {
        return this.usersService.get(user.uid);
      }
      return of(null);
    }),
    tap(user => {
      if (user && !user.admin && !user.editor) {
        this.logout();
        this.message.error('Only editors and admins can log in to manage content.')
      }
    })
  );

  constructor(private af: AngularFireAuth,
              private usersService: UsersService,
              private message: NzMessageService) {
  }

  public logout(): void {
    this.af.signOut();
  }
}
