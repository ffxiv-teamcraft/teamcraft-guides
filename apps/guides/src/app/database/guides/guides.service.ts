import { Injectable, inject } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Guide } from '../+state/model/guide';

@Injectable({
  providedIn: 'root'
})
export class GuidesService extends FirestoreService<Guide> {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const af = inject(AngularFirestore);

    super(af);
  }

  protected getKeyField(): keyof Guide {
    return 'slug';
  }

  protected getBaseUrl(): string {
    return 'guides';
  }
}
