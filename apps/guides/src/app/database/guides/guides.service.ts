import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Guide } from '../+state/guide';

@Injectable({
  providedIn: 'root'
})
export class GuidesService extends FirestoreService<Guide> {

  constructor(af: AngularFirestore) {
    super(af);
  }

  protected getKeyField(): keyof Guide {
    return 'slug';
  }

  protected getBaseUrl(): string {
    return 'guides';
  }
}
