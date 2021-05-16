import { Guide } from '../../../database/+state/model/guide';
import { GuideCategory } from '../../../database/+state/model/guide-category';

export interface HomePageDisplay {
  news: Guide[];
  random: Guide;
  categorized: { category: GuideCategory, guides: Guide[] }[];
}
