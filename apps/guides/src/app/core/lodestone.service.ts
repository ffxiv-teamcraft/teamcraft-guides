import { Injectable } from '@angular/core';
import { Character, XivapiService } from '@xivapi/angular-client';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LodestoneService {

  private cache: Record<number, Observable<Character>> = {};

  constructor(private xivapi: XivapiService) {
  }

  public getCharacter(id: number): Observable<Character> {
    if (!this.cache[id]) {
      this.cache[id] = this.xivapi.getCharacter(id, { columns: ['Character.Avatar', 'Character.Name', 'Character.Title'] }).pipe(
        map(response => response.Character),
        shareReplay()
      );
    }
    return this.cache[id];
  }
}
