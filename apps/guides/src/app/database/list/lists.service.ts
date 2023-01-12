import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { FirestoreService } from '../firestore.service';
import { TeamcraftList } from './teamcraft-list';

@Injectable({
  providedIn: 'root'
})
export class ListsService extends FirestoreService<TeamcraftList> {

  constructor(firestore: Firestore) {
    super(firestore);
  }

  protected getBaseUrl(): string {
    return 'lists';
  }
}
