import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Character, XivapiService } from '@xivapi/angular-client';
import { interval, Observable, Subject } from 'rxjs';
import { map, shareReplay, switchMapTo } from 'rxjs/operators';
import { firstIfServer } from './rxjs/first-if-server';

@Injectable({ providedIn: 'root' })
export class LodestoneService {

  private cache: Record<number, Observable<Character>> = {};

  private queue: Subject<void>[] = [];

  constructor(private xivapi: XivapiService,
              @Inject(PLATFORM_ID) private platform: Object) {
    interval(1000).subscribe(() => {
      const req = this.queue.shift();
      if (req) {
        req.next();
      }
    });
  }

  public getCharacter(id: number): Observable<Character> {
    if (!this.cache[id]) {
      const trigger = new Subject<void>();
      this.cache[id] = trigger.pipe(
        switchMapTo(this.xivapi.getCharacter(id, { columns: ['Character.Avatar', 'Character.Name', 'Character.Title'] })),
        map(response => response.Character),
        shareReplay(),
        firstIfServer(this.platform)
      );
      this.queue.push(trigger);
    }
    return this.cache[id];
  }
}
