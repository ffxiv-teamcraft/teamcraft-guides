import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { distinctUntilChanged, filter, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { XivAction } from './xiv-action';
import { XivItem } from './xiv-item';
import { XivMap } from './xiv-map';
import { HttpClient } from '@angular/common/http';
import { DataEndpoint } from './data-endpoint';
import { uniq } from 'lodash';
import { XivActionSearch } from './xiv-action-search';

@Injectable({
  providedIn: 'root'
})
export class XivapiDataService {

  private actions: { [index: number]: Observable<any> } = {};

  private cache$ = new BehaviorSubject<Partial<Record<string, Record<number, any>>>>({});

  constructor(private http: HttpClient) {
  }

  private preload<T = unknown>(endpoint: DataEndpoint, ids: number[]): Observable<T[]> {
    const endpointCache = this.cache$.value[endpoint];
    let missing = ids;
    if (endpointCache) {
      missing = missing.filter(id => endpointCache[id] === undefined);
    }
    if (ids.length > 0 && missing.length === 0) {
      return of(ids.map(id => endpointCache[id]));
    } else {
      return this.http.get(`${endpoint}/${ids.join(',')}`).pipe(
        map(record => {
          return Object.entries(record).map(([key, row]) => {
            return {
              id: +key,
              ...row
            };
          });
        }),
        map(list => {
          return [
            ...list,
            ...ids.map(id => endpointCache && endpointCache[id]).filter(val => !!val)
          ];
        }),
        tap(rows => {
          const newEndpointCache = this.cache$.value[endpoint] || {};
          rows.forEach(row => {
            newEndpointCache[row.id] = row;
          });
          this.cache$.next({
            ...this.cache$.value,
            [endpoint]: newEndpointCache
          });
        })
      );
    }
  }

  public getAllActions(): Observable<XivActionSearch[]> {
    return this.http.get(`https://api.ffxivteamcraft.com/search?query=&filters=job>=8,job<=18&type=Action`).pipe(
      map(record => {
        return Object.values(record);
      }),
      tap(actions => {
        //Ugly but it's a quick and dirty patch
        actions.forEach(action => {
          this.actions[action.id] = of(action).pipe(
            shareReplay(1)
          );
        });
      })
    );
  }

  public getActions(ids: number[]): Observable<XivAction[]> {
    return this.http.get(`${DataEndpoint.ACTION}/${ids.join(',')}`).pipe(
      map(record => {
        return Object.values(record);
      }),
      tap(actions => {
        //Ugly but it's a quick and dirty patch
        actions.forEach(action => {
          this.actions[action.id] = of(action).pipe(
            shareReplay(1)
          );
        });
      })
    );
  }

  public getActionTooltipData(id: number): Observable<XivAction> {
    if (this.actions[id] === undefined) {
      this.actions[id] = this.http.get(`${DataEndpoint.ACTION}/${id}`).pipe(
        map(data => data[id]),
        shareReplay(1)
      );
    }
    return this.actions[id];
  }

  public getItems(ids: number[]): Observable<XivItem[]> {
    return this.preload<XivItem>(DataEndpoint.ITEM, ids);
  }

  public getMaps(ids: number[]): Observable<XivMap[]> {
    return this.preload<XivMap>(DataEndpoint.MAP, ids).pipe(
      switchMap(maps => {
        const placesToLoad: number[] = uniq([].concat.apply(maps.map(entry => ([entry.placename_id, entry.placename_sub_id]))));
        return this.preload(DataEndpoint.PLACENAME, placesToLoad).pipe(
          map(placeNames => {
            return maps.map(entry => {
              entry.name = placeNames[entry.placename_id] as any;
              entry.name_sub = placeNames[entry.placename_sub_id] as any;
              return entry;
            });
          })
        );
      })
    );
  }

  public getMap(id: number): Observable<XivMap> {
    return this.get<XivMap>(DataEndpoint.MAP, id).pipe(
      switchMap((entry) => {
        return combineLatest([this.get(DataEndpoint.PLACENAME, entry.placename_id), this.get(DataEndpoint.PLACENAME, entry.placename_sub_id)]).pipe(
          map(([name, name_sub]) => {
            return {
              ...entry,
              name,
              name_sub
            } as XivMap;
          })
        );
      })
    );
  }

  public get<T>(endpoint: DataEndpoint, id: number): Observable<T> {
    return this.cache$.pipe(
      map(cache => cache[endpoint]),
      filter(endpointCache => !!endpointCache),
      map(endpointCache => endpointCache[id]),
      distinctUntilChanged()
    );
  }
}
