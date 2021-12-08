import { Injectable } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { TeamcraftList } from './teamcraft-list';

@Injectable({
  providedIn: 'root'
})
export class ListsService extends FirestoreService<TeamcraftList> {

  constructor(af: AngularFirestore) {
    super(af);
  }

  protected getBaseUrl(): string {
    return 'lists';
  }
}
