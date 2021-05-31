import { DataModel } from '../../data-model';
import { GuideCategory } from './guide-category';
import { GuideSubCategory } from './guide-sub-category';

export interface Guide extends DataModel {
  author: string;
  contributors: string[];
  slug: string;
  title: string;
  navTitle: string;
  content: string;
  description: string;
  published: boolean;
  category: GuideCategory;
  subCategory: GuideSubCategory;

  updated: number;
  publishDate?: number;

  banner?: string;
}
