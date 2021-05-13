import { DataModel } from '../data-model';

interface ListRow {
  id: number;
  amount: number;
  recipeId?: string;
}

export interface TeamcraftList extends DataModel {
  name: string;
  finalItems: ListRow[];
  items: ListRow[];
}
