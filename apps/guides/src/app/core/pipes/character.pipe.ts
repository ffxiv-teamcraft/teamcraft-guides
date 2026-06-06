import { Pipe, PipeTransform, PLATFORM_ID, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '@xivapi/angular-client';
import { switchMap } from 'rxjs/operators';
import { LodestoneService } from '../lodestone.service';
import { UsersService } from '../../database/user/users.service';
import { firstIfServer } from '../rxjs/first-if-server';

@Pipe({
    name: 'character',
    standalone: false
})
export class CharacterPipe implements PipeTransform {
  private lodestone = inject(LodestoneService);
  private usersService = inject(UsersService);
  private platform = inject<Object>(PLATFORM_ID);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
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
