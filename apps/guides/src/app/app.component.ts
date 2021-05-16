import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from './database/auth.service';
import { GuidesFacade } from './database/+state/guides.facade';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GuideCategory } from './database/+state/model/guide-category';
import { Guide } from './database/+state/model/guide';
import { LoginPopupComponent } from './core/login-popup/login-popup.component';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

declare const gtag: Function;

@Component({
  selector: 'guides-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  user$ = this.authService.user$;

  isCollapsed = true;

  navBarContent$: Observable<Record<GuideCategory, Partial<Guide>[]>> = this.guidesFacade.allGuides$.pipe(
    map(guides => {
      return guides.reduce((navbar, guide) => {
        if (!GuideCategory[guide.category]) {
          guide.category = GuideCategory.Other;
        }
        let ribbon: string = null;
        if (guide.published) {
          // New guide if it has been created less than a week ago
          const isNew = (Date.now() - guide.publishDate) < 86_400_000 * 7;
          // Updated if it has been updated less than a week ago
          const isUpdated = (Date.now() - guide.updated) < 86_400_000 * 7;
          if (isNew) {
            ribbon = 'New !';
          } else if (isUpdated) {
            ribbon = 'Updated !';
          }
        }
        return {
          ...navbar,
          [guide.category]: [...(navbar[guide.category] || []), {
            slug: guide.slug,
            navTitle: guide.navTitle,
            published: guide.published,
            ribbon
          }]
        };
      }, {} as Record<GuideCategory, Partial<Guide>[]>);
    })
  );

  @ViewChild('scrollContainerRef', { static: false })
  scrollContainer: ElementRef;

  constructor(private nzModal: NzModalService,
              private authService: AuthService,
              private guidesFacade: GuidesFacade,
              private router: Router,
              @Inject(PLATFORM_ID) private platform: Object) {
    this.guidesFacade.init();
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = 0;
      }
    });

    router.events
      .pipe(
        distinctUntilChanged((previous: any, current: any) => {
          if (current instanceof NavigationEnd) {
            return previous.url === current.url;
          }
          return true;
        })
      ).subscribe((event: any) => {
      if (isPlatformBrowser(this.platform)) {
        gtag('set', 'page', event.url);
        gtag('event', 'page_view', {
          page_path: event.urlAfterRedirects
        });
      }
    });

  }

  login(): void {
    this.nzModal.create({
      nzContent: LoginPopupComponent,
      nzFooter: null
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
