import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { map } from 'rxjs/operators';
import { CategorizedGuides, HomePageDisplay } from './home-page-display';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { GuideCategory } from '../../../database/+state/model/guide-category';
import { Guide } from '../../../database/+state/model/guide';

@Component({
  selector: 'guides-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {

  display$: Observable<HomePageDisplay> = this.guidesFacade.allGuides$.pipe(
    map(guides => {

      return {
        featured: guides.filter(guide => guide.featured),
        crafting: this.getGuidesForCategory(guides, GuideCategory.Crafting),
        gathering: this.getGuidesForCategory(guides, GuideCategory.Gathering),
        other: this.getGuidesForCategory(guides, GuideCategory.Other)
      };
    })
  );

  platformBrowser = isPlatformBrowser(this.platform);

  constructor(private guidesFacade: GuidesFacade,
              @Inject(PLATFORM_ID) private platform: Object) {
  }

  getGuidesForCategory(guides: Guide[], category: GuideCategory): CategorizedGuides[] {
    return guides
      .filter(guide => guide.category === category)
      .reduce((acc, guide) => {
        let entry = acc.find(e => e.subCategory === (guide.subCategory || '_Other'));
        if (!entry) {
          const subCategory = (guide.subCategory || '_Other');
          acc.push({
            subCategory: subCategory,
            label: subCategory.split('_')[1],
            guides: []
          });
          entry = acc[acc.length - 1];
        }
        entry.guides.push(guide);
        return [...acc];
      }, []);
  }

}
