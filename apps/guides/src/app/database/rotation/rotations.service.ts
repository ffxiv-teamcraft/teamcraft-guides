import { Injectable, inject } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TeamcraftRotation } from './teamcraft-rotation';

@Injectable({
  providedIn: 'root'
})
export class RotationsService extends FirestoreService<TeamcraftRotation> {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const af = inject(AngularFirestore);

    super(af);
  }

  protected getBaseUrl(): string {
    return 'rotations';
  }
}
