import { DataModel } from '../data-model';

export interface Guide extends DataModel {
  author: string;
  slug: string;
  title: string;
  content: string;
  description: string;
  published: boolean;
}
