import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TeamcraftUser } from './teamcraft-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends FirestoreService<TeamcraftUser> {

  constructor(af: AngularFirestore) {
    super(af);
  }

  protected getBaseUrl(): string {
    return 'users';
  }
}
