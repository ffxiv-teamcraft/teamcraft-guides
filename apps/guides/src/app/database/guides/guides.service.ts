import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Firestore } from '@angular/fire/firestore';
import { Guide } from '../+state/model/guide';

@Injectable({
  providedIn: 'root'
})
export class GuidesService extends FirestoreService<Guide> {

  constructor(firestore: Firestore) {
    super(firestore);
  }

  protected getKeyField(): keyof Guide {
    return 'slug';
  }

  protected getBaseUrl(): string {
    return 'guides';
  }
}
