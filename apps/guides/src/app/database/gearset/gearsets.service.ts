import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TeamcraftGearset } from './teamcraft-gearset';

@Injectable({
  providedIn: 'root'
})
export class GearsetsService extends FirestoreService<TeamcraftGearset> {

  constructor(af: AngularFirestore) {
    super(af);
  }

  protected getBaseUrl(): string {
    return 'gearsets';
  }
}
