import { DataModel } from '../../data-model';
import { GuideCategory } from './guide-category';

export interface Guide extends DataModel {
  author: string;
  contributors: string[];
  slug: string;
  title: string;
  navTitle: string;
  content: string;
  description: string;
  showInHomePage: boolean;
  published: boolean;
  category: GuideCategory;

  updated: number;
  publishDate?: number;
}
