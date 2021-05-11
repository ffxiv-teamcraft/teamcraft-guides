import { Inject, Pipe, PipeTransform, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '@xivapi/angular-client';
import { switchMap } from 'rxjs/operators';
import { LodestoneService } from '../lodestone.service';
import { UsersService } from '../../database/user/users.service';
import { firstIfServer } from '../rxjs/first-if-server';

@Pipe({
  name: 'character'
})
export class CharacterPipe implements PipeTransform {

  constructor(private lodestone: LodestoneService, private usersService: UsersService,
              @Inject(PLATFORM_ID) private platform: Object) {
  }

  transform(userId: string): Observable<Pick<Character, 'Avatar' | 'Name' | 'Title'>> {
    return this.usersService.get(userId).pipe(
      switchMap(user => {
        return this.lodestone.getCharacter(user.defaultLodestoneId);
      }),
      firstIfServer(this.platform)
    );
  }
}
