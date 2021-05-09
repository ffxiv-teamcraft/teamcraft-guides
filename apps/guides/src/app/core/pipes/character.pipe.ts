import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
import { Character } from '@xivapi/angular-client';
import { switchMap } from 'rxjs/operators';
import { LodestoneService } from '../lodestone.service';
import { UsersService } from '../../database/user/users.service';

@Pipe({
  name: 'character'
})
export class CharacterPipe implements PipeTransform {

  constructor(private lodestone: LodestoneService, private usersService: UsersService) {
  }

  transform(userId: string): Observable<Pick<Character, 'Avatar' | 'Name' | 'Title'>> {
    return this.usersService.get(userId).pipe(
      switchMap(user => {
        return this.lodestone.getCharacter(user.defaultLodestoneId);
      })
    );
  }
}
