import { Injectable } from '@angular/core';
import { XivapiEndpoint, XivapiService } from '@xivapi/angular-client';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, tap } from 'rxjs/operators';
import { Action } from './action';

@Injectable({
  providedIn: 'root'
})
export class XivapiDataService {

  private cache$ = new BehaviorSubject<Partial<Record<XivapiEndpoint, Record<number, any>>>>({});

  constructor(private xivapi: XivapiService) {
  }

  private preload<T = unknown>(endpoint: XivapiEndpoint, columns: string[], ids: number[]): Observable<T[]> {
    const endpointCache = this.cache$.value[endpoint];
    let missing = ids;
    if (endpointCache) {
      missing = missing.filter(id => endpointCache[id] === undefined);
    }
    if (missing.length === 0) {
      return of(ids.map(id => endpointCache[id]));
    } else {
      return this.xivapi.getList(endpoint, {
        columns: ['ID', ...columns],
        ids: missing
      }).pipe(
        map(list => {
          return [
            ...list.Results,
            ...ids.map(id => endpointCache && endpointCache[id]).filter(val => !!val)
          ];
        }),
        tap(rows => {
          const newEndpointCache = this.cache$.value[endpoint] || {};
          rows.forEach(row => {
            newEndpointCache[row.ID] = row;
          });
          this.cache$.next({
            ...this.cache$.value,
            [endpoint]: newEndpointCache
          });
        })
      );
    }
  }

  public getActions(ids: number[]): Observable<Action[]> {
    return this.preload<Action>(XivapiEndpoint.Action, ['Name_*', 'Description_*', 'IconHD'], ids);
  }

  public getCraftActions(ids: number[]): Observable<Action[]> {
    return this.preload<Action>(XivapiEndpoint.CraftAction, ['Name_*', 'Description_*', 'IconHD'], ids);
  }

  public get<T>(endpoint: XivapiEndpoint, id: number): Observable<T> {
    return this.cache$.pipe(
      map(cache => cache[endpoint]),
      filter(endpointCache => !!endpointCache),
      map(endpointCache => endpointCache[id]),
      distinctUntilChanged()
    );
  }
}
