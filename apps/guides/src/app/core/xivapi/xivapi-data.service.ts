import { Injectable } from '@angular/core';
import { XivapiEndpoint, XivapiList, XivapiSearchOptions, XivapiService } from '@xivapi/angular-client';
import { BehaviorSubject, combineLatest, EMPTY, Observable, of } from 'rxjs';
import { distinctUntilChanged, expand, filter, last, map, shareReplay, tap } from 'rxjs/operators';
import { XivAction } from './xiv-action';
import { XivItem } from './xiv-item';
import { XivMap } from './xiv-map';

@Injectable({
  providedIn: 'root'
})
export class XivapiDataService {

  private actions: { [index: number]: Observable<any> } = {};

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
      return this.getAllContentPages(endpoint, columns, missing).pipe(
        map(list => {
          return [
            ...list,
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

  public getActions(ids: number[]): Observable<XivAction[]> {
    const craftActions = ids.filter(id => id >= 100000);
    const actions = ids.filter(id => id < 100000);
    return combineLatest([
      this.preload<XivAction>(XivapiEndpoint.CraftAction, ['Name_*', 'Description_*', 'IconHD'], craftActions),
      this.preload<XivAction>(XivapiEndpoint.Action, ['Name_*', 'Description_*', 'IconHD'], actions)
    ]).pipe(
      map(([craftActions, actions]) => [...actions, ...craftActions])
    );
  }

  public getActionTooltipData(id: number): Observable<any> {
    if (this.actions[id] === undefined) {
      if (id > 99999) {
        this.actions[id] = this.xivapi.get(XivapiEndpoint.CraftAction, id).pipe(
          shareReplay(1)
        );
      } else {
        this.actions[id] = this.xivapi.get(XivapiEndpoint.Action, id).pipe(
          shareReplay(1)
        );
      }
    }
    return this.actions[id];
  }

  public getItems(ids: number[]): Observable<XivItem[]> {
    return this.preload<XivItem>(XivapiEndpoint.Item, ['Name_*', 'IconHD'], ids);
  }

  public getMaps(ids: number[]): Observable<XivMap[]> {
    return this.preload<XivMap>(XivapiEndpoint.Map, ['PlaceName', 'PlaceNameSub', 'SizeFactor', 'MapFilename', 'OffsetX', 'OffsetY'], ids);
  }

  public get<T>(endpoint: XivapiEndpoint, id: number): Observable<T> {
    return this.cache$.pipe(
      map(cache => cache[endpoint]),
      filter(endpointCache => !!endpointCache),
      map(endpointCache => endpointCache[id]),
      distinctUntilChanged()
    );
  }

  public getAllContentPages<T>(endpoint: XivapiEndpoint, columns: string[], ids: number[]): Observable<T[]> {
    return of({ done: false, content: [], next: 1 }).pipe(
      expand((acc) => {
        if (!acc.next) {
          return EMPTY;
        }
        return this.xivapi.getList<T>(endpoint, {
          columns: ['ID', ...columns],
          ids: ids,
          page: +acc.next,
          max_items: 1000
        }).pipe(
          map((res: XivapiList<T>) => {
            return {
              ...acc,
              content: [...acc.content, ...res.Results],
              next: res.Pagination.Page === res.Pagination.PageNext ? null : res.Pagination.PageNext
            };
          })
        );
      }),
      map(acc => acc.content),
      last()
    );
  }

  public getAllSearchPages<T>(searchOptions: XivapiSearchOptions): Observable<T[]> {
    return of({ done: false, content: [], next: 1 }).pipe(
      expand((acc) => {
        if (!acc.next) {
          return EMPTY;
        }
        return this.xivapi.search({ ...searchOptions, page: +acc.next, limit: 250 }).pipe(
          map((res: XivapiList<T>) => {
            return {
              ...acc,
              content: [...acc.content, ...res.Results],
              next: res.Pagination.PageNext
            };
          })
        );
      }),
      map(acc => acc.content),
      last()
    );
  }
}
