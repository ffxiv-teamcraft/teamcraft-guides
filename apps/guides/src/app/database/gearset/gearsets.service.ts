import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Firestore } from '@angular/fire/firestore';
import { TeamcraftGearset } from './teamcraft-gearset';

@Injectable({
  providedIn: 'root'
})
export class GearsetsService extends FirestoreService<TeamcraftGearset> {

  constructor(firestore: Firestore) {
    super(firestore);
  }

  protected getBaseUrl(): string {
    return 'gearsets';
  }
}
