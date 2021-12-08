import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CategorizedGuides } from '../../../pages/home/home/home-page-display';
import { combineLatest, ReplaySubject } from 'rxjs';
import { Guide } from '../../../database/+state/model/guide';
import { map, shareReplay } from 'rxjs/operators';

interface XivHorizontalTabsMenu {
  title: string;
  guides: Guide[];
}

@Component({
  selector: 'guides-xiv-horizontal-tabs',
  templateUrl: './xiv-horizontal-tabs.component.html',
  styleUrls: ['./xiv-horizontal-tabs.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XivHorizontalTabsComponent implements OnInit {

  @Input()
  guides: CategorizedGuides[];

  menus$ = new ReplaySubject<XivHorizontalTabsMenu[]>();

  selected$ = new ReplaySubject<Guide>();

  expanded$ = new ReplaySubject<string>();

  display$ = combineLatest([this.menus$, this.selected$, this.expanded$]).pipe(
    map(([menus, selected, expanded]) => ({ menus, selected, expanded })),
    shareReplay(1)
  );

  ngOnInit(): void {
    this.menus$.next(
      this.guides.map((category, i) => {
        return {
          title: category.label,
          new: category.guides.some(guide => (Date.now() - guide.publishDate) / 1000 < 7 * 86400),
          updatedRecently: category.guides.some(guide => (Date.now() - guide.updated) / 1000 < 7 * 86400),
          guides: category.guides.map(guide => {
            return {
              ...guide,
              new: (Date.now() - guide.publishDate) / 1000 < 7 * 86400,
              updatedRecently: (Date.now() - guide.updated) / 1000 < 7 * 86400
            };
          })
        };
      })
    );

    if (this.guides[0]) {
      this.selected$.next(this.guides[0].guides[0]);
      this.expanded$.next(this.guides[0].label);
    }


  }

}
