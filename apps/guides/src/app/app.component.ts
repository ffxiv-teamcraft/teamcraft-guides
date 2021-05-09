import { Component } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { LoginPopupComponent } from './core/login-popup/login-popup.component';
import { AuthService } from './database/auth.service';
import { GuidesFacade } from './database/+state/guides.facade';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GuideCategory } from './database/+state/model/guide-category';
import { Guide } from './database/+state/model/guide';

@Component({
  selector: 'guides-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {

  user$ = this.authService.user$;

  navBarContent$: Observable<Record<GuideCategory, Partial<Guide>[]>> = this.guidesFacade.allGuides$.pipe(
    map(guides => {
      return guides.reduce((navbar, guide) => {
        if (!GuideCategory[guide.category]) {
          guide.category = GuideCategory.Other;
        }
        return {
          ...navbar,
          [guide.category]: [...(navbar[guide.category] || []), {
            slug: guide.slug,
            navTitle: guide.navTitle,
            published: guide.published
          }]
        };
      }, {} as Record<GuideCategory, Partial<Guide>[]>);
    })
  );

  constructor(private nzModal: NzModalService,
              private authService: AuthService,
              private guidesFacade: GuidesFacade) {
    this.guidesFacade.init();
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
