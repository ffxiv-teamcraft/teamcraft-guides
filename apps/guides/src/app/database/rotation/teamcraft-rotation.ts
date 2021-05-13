import { DataModel } from '../data-model';

export interface TeamcraftRotation extends DataModel {
  name: string;
  rotation: string[];
  custom?: boolean;
  defaultItemId?: number;
  defaultRecipeId?: number;
}
