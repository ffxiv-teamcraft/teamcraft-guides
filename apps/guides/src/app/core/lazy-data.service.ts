import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LazyDataService {

  private cache: Record<string, Observable<any>> = {};

  constructor(private http: HttpClient) {
  }

  get<T = any>(name: string): Observable<T> {
    if (this.cache[name] === undefined) {
      this.cache[name] = this.http.get(`https://raw.githubusercontent.com/ffxiv-teamcraft/ffxiv-teamcraft/master/libs/data/src/lib/json/${name}.json`).pipe(
        shareReplay()
      );
    }
    return this.cache[name];
  }

}
