import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { map } from 'rxjs/operators';
import { HomePageDisplay } from './home-page-display';
import { Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { GuideCategory } from '../../../database/+state/model/guide-category';

@Component({
  selector: 'guides-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent {

  display$: Observable<HomePageDisplay> = this.guidesFacade.allGuides$.pipe(
    map(guides => {
      const displayPool = guides
        .filter(guide => guide.published)
        .sort((a, b) => b.updated - a.updated);

      return {
        news: displayPool.slice(0, 4),
        random: displayPool[Math.floor(Math.random() * displayPool.length)],
        categorized: displayPool
          .reduce((acc, guide) => {
            let entry = acc.find(e => e.category === guide.category);
            if (!entry) {
              acc.push({ category: guide.category, guides: [] });
              entry = acc[acc.length - 1];
            }
            entry.guides.push(guide);
            return [...acc];
          }, [])
          .sort((a, b) => a.category > b.category ? 1 : -1)
      };
    })
  );

  platformBrowser = isPlatformBrowser(this.platform);

  GuideCategory = GuideCategory;

  constructor(private guidesFacade: GuidesFacade,
              @Inject(PLATFORM_ID) private platform: Object) {
  }

}
