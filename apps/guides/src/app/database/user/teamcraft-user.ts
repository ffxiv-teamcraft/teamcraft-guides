import { DataModel } from '../data-model';
import { Character } from '@xivapi/angular-client';

export interface TeamcraftUser extends DataModel {
  defaultLodestoneId: number;
  customCharacters: Partial<Character>[];
  admin: boolean;
  moderator: boolean;
  editor: boolean;
}
