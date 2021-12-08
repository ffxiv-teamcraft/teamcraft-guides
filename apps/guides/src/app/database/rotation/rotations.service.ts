import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TeamcraftRotation } from './teamcraft-rotation';

@Injectable({
  providedIn: 'root'
})
export class RotationsService extends FirestoreService<TeamcraftRotation> {

  constructor(af: AngularFirestore) {
    super(af);
  }

  protected getBaseUrl(): string {
    return 'rotations';
  }
}
