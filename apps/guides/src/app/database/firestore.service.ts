import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { DataModel } from './data-model';
import { QueryFn } from '@angular/fire/firestore/interfaces';

export abstract class FirestoreService<T extends DataModel> {

  protected constructor(private af: AngularFirestore) {
  }

  protected getKeyField(): keyof T {
    return '$key';
  }

  public get(key: string): Observable<T> {
    return this.af.doc<T>(`${this.getBaseUrl()}/${key}`).get({ source: 'server' }).pipe(
      map(snapshot => {
        return {
          [this.getKeyField()]: snapshot.id,
          ...snapshot.data({ serverTimestamps: 'estimate' })
        };
      }),
      first()
    );
  }

  public getAll(query?: QueryFn): Observable<T[]> {
    return this.af.collection<T>(this.getBaseUrl(), query).get({ source: 'server' }).pipe(
      map(snapshots => {
        return snapshots.docs.map(snapshot => {
          return {
            [this.getKeyField()]: snapshot.id,
            ...snapshot.data({ serverTimestamps: 'estimate' })
          };
        });
      }),
      first()
    );
  }

  public save(data: T): Observable<void> {
    if (!data[this.getKeyField()]) {
      (<any>data[this.getKeyField()]) = this.af.createId();
    }
    return from(this.af.doc<T>(`${this.getBaseUrl()}/${data[this.getKeyField()]}`).set(data));
  }

  public remove(key: string): Observable<void> {
    return from(this.af.doc<T>(`${this.getBaseUrl()}/${key}`).delete());
  }

  protected abstract getBaseUrl(): string;
}
