import { AfterContentInit, Component, Inject, PLATFORM_ID } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { first, map, switchMapTo, tap } from 'rxjs/operators';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AuthService } from '../../../database/auth.service';
import { Guide } from '../../../database/+state/model/guide';
import { TableOfContentEntry } from '../../../core/guide-content/table-of-content-entry';

@Component({
  selector: 'guides-guide',
  templateUrl: './guide.component.html',
  styleUrls: ['./guide.component.less']
})
export class GuideComponent implements AfterContentInit {

  public guide$: Observable<Guide> = this.route.paramMap.pipe(
    map(params => params.get('slug')),
    tap((slug: string) => {
      this.guidesFacade.select(slug);
    }),
    switchMapTo(this.guidesFacade.selectedGuides$)
  );

  public loading$ = this.guidesFacade.loading$;

  public isEditor$ = combineLatest([this.guide$, this.authService.user$]).pipe(
    map(([guide, user]) => user?.admin || user?.$key === guide.author)
  );

  public tableOfContents$ = new Subject<TableOfContentEntry[]>();

  constructor(private guidesFacade: GuidesFacade,
              private authService: AuthService,
              private route: ActivatedRoute,
              @Inject(PLATFORM_ID) private platform: Object,
              @Inject(DOCUMENT) private document: Document) {
    this.guidesFacade.init();
  }

  ngAfterContentInit(): void {
    if (isPlatformBrowser(this.platform)) {
      combineLatest([this.route.fragment, this.tableOfContents$]).pipe(
        first()
      ).subscribe(([fragment]) => {
        if (fragment) {
          const matchingTitle = document.getElementById(fragment);
          if (matchingTitle) {
            matchingTitle.scrollIntoView();
          }
        }
      });
    }
  }

}
