import { Guide } from '../../../database/+state/model/guide';
import { GuideSubCategory } from '../../../database/+state/model/guide-sub-category';

export interface CategorizedGuides {
  subCategory: GuideSubCategory;
  label: string;
  guides: Guide[];
}

export interface HomePageDisplay {
  featured: Guide[];
  crafting: CategorizedGuides[];
  gathering: CategorizedGuides[];
  other: CategorizedGuides[];
}
