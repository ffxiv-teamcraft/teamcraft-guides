import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Firestore } from '@angular/fire/firestore';
import { TeamcraftRotation } from './teamcraft-rotation';

@Injectable({
  providedIn: 'root'
})
export class RotationsService extends FirestoreService<TeamcraftRotation> {

  constructor(firestore: Firestore) {
    super(firestore);
  }

  protected getBaseUrl(): string {
    return 'rotations';
  }
}
