import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Firestore } from '@angular/fire/firestore';
import { TeamcraftUser } from './teamcraft-user';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends FirestoreService<TeamcraftUser> {

  constructor(firestore: Firestore) {
    super(firestore);
  }

  protected getBaseUrl(): string {
    return 'users';
  }
}
