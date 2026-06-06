import { Injectable, inject } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { TeamcraftUser } from './teamcraft-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends FirestoreService<TeamcraftUser> {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const af = inject(AngularFirestore);

    super(af);
  }

  protected getBaseUrl(): string {
    return 'users';
  }
}
