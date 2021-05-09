import { DataModel } from '../../data-model';
import { GuideCategory } from './guide-category';

export interface Guide extends DataModel {
  author: string;
  slug: string;
  title: string;
  navTitle: string;
  content: string;
  description: string;
  published: boolean;
  category: GuideCategory;
}
