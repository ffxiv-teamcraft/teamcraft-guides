import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { DataModel } from './data-model';
import {
  collection,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docSnapshots,
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  setDoc,
  WithFieldValue
} from '@angular/fire/firestore';

export abstract class FirestoreService<T extends DataModel> {

  protected converter: FirestoreDataConverter<T> = {
    toFirestore: (modelObject: WithFieldValue<T>): DocumentData => {
      return modelObject;
    },
    fromFirestore: (snapshot: QueryDocumentSnapshot): T => {
      return <T>{
        ...snapshot.data({ serverTimestamps: 'estimate' }),
        [this.getKeyField()]: snapshot.id
      };
    }
  };

  protected readonly collection: CollectionReference<T> = collection(this.firestore, this.getBaseUrl()).withConverter(this.converter);

  protected constructor(private firestore: Firestore) {
  }

  protected getKeyField(): keyof T {
    return '$key';
  }

  public docRef(key: string): DocumentReference<T> {
    return doc(this.firestore, this.getBaseUrl(), key).withConverter(this.converter);
  }

  public get(key: string): Observable<T> {
    return docSnapshots<T>(this.docRef(key)).pipe(
      map(snap => snap.data()),
      take(2)
    );
  }

  public getAll(...filterQuery: QueryConstraint[]): Observable<T[]> {
    return collectionData(query(this.collection, ...filterQuery).withConverter(this.converter)).pipe(
      take(2)
    );
  }

  public save(data: T): Observable<void> {
    if (!data[this.getKeyField()]) {
      (<any>data[this.getKeyField()]) = this.firestore;
    }
    return from(setDoc(this.docRef(data[this.getKeyField()] as string), data));
  }

  public remove(key: string): Observable<void> {
    return from(deleteDoc(this.docRef(key)));
  }

  protected abstract getBaseUrl(): string;
}
