import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { first, map, take } from 'rxjs/operators';
import { DataModel } from './data-model';
import { QueryFn } from '@angular/fire/firestore/interfaces';

export abstract class FirestoreService<T extends DataModel> {

  protected constructor(private af: AngularFirestore) {
  }

  protected getKeyField(): keyof T {
    return '$key';
  }

  public get(key: string): Observable<T> {
    return this.af.doc<T>(`${this.getBaseUrl()}/${key}`).snapshotChanges().pipe(
      map(change => {
        return {
          [this.getKeyField()]: change.payload.id,
          ...change.payload.data({ serverTimestamps: 'estimate' })
        };
      }),
      take(2)
    );
  }

  public getAll(query?: QueryFn): Observable<T[]> {
    return this.af.collection<T>(this.getBaseUrl(), query).snapshotChanges().pipe(
      map(snapshots => {
        return snapshots.map(snapshot => {
          return {
            [this.getKeyField()]: snapshot.payload.doc.id,
            ...snapshot.payload.doc.data({ serverTimestamps: 'estimate' })
          };
        });
      }),
      take(2)
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
