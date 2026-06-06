import { Injectable, inject } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TeamcraftList } from './teamcraft-list';

@Injectable({
  providedIn: 'root'
})
export class ListsService extends FirestoreService<TeamcraftList> {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const af = inject(AngularFirestore);

    super(af);
  }

  protected getBaseUrl(): string {
    return 'lists';
  }
}
