import { Injectable, inject } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TeamcraftGearset } from './teamcraft-gearset';

@Injectable({
  providedIn: 'root'
})
export class GearsetsService extends FirestoreService<TeamcraftGearset> {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const af = inject(AngularFirestore);

    super(af);
  }

  protected getBaseUrl(): string {
    return 'gearsets';
  }
}
