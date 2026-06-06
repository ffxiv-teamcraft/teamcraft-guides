import { Component, ElementRef, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AuthService } from './database/auth.service';
import { GuidesFacade } from './database/+state/guides.facade';
import { distinctUntilChanged, filter, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { GuideCategory } from './database/+state/model/guide-category';
import { Guide } from './database/+state/model/guide';
import { LoginPopupComponent } from './core/login-popup/login-popup.component';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { NzIconDirective, NzIconService } from 'ng-zorro-antd/icon';
import { Pirsch } from 'pirsch-sdk/web';
import { NzMenuDirective, NzMenuItemComponent, NzSubMenuComponent } from 'ng-zorro-antd/menu';
import { FlexModule } from '@angular/flex-layout/flex';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import {
  NzContentComponent,
  NzFooterComponent,
  NzHeaderComponent,
  NzLayoutComponent,
  NzSiderComponent
} from 'ng-zorro-antd/layout';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { CharacterPipe } from './core/pipes/character.pipe';
import { IfMobilePipe } from './core/pipes/if-mobile.pipe';

@Component({
  selector: 'guides-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
  imports: [NzMenuDirective, FlexModule, NzSubMenuComponent, ɵNzTransitionPatchDirective, NzMenuItemComponent, RouterLink, NzIconDirective, NzTooltipDirective, ExtendedModule, NzButtonComponent, NzLayoutComponent, NzHeaderComponent, NgTemplateOutlet, NzWaveDirective, NzSiderComponent, NzContentComponent, RouterOutlet, NzFooterComponent, AsyncPipe, CharacterPipe, IfMobilePipe]
})
export class AppComponent {
  private nzModal = inject(NzModalService);
  private authService = inject(AuthService);
  private guidesFacade = inject(GuidesFacade);
  private iconService = inject(NzIconService);
  private platform = inject<Object>(PLATFORM_ID);


  user$ = this.authService.user$;

  isCollapsed = true;

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

  @ViewChild('scrollContainerRef', { static: false })
  scrollContainer: ElementRef;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const router = inject(Router);

    this.guidesFacade.init();
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = 0;
      }
    });
    const pirsch = new Pirsch({
      identificationCode: 'eNsUPn6rQanAcXe9lKap2jaYjEx4Kkdt',
      hostname: 'guides.ffxivteamcraft.com'
    });

    router.events
      .pipe(
        distinctUntilChanged((previous: any, current: any) => {
          if (current instanceof NavigationEnd) {
            return previous.url === current.url;
          }
          return true;
        })
      ).subscribe(() => {
      if (isPlatformBrowser(this.platform)) {
        pirsch.hit();
      }
    });

    if (isPlatformBrowser(this.platform)) {
      this.iconService.fetchFromIconfont({ scriptUrl: 'https://at.alicdn.com/t/font_931253_uosqqkkbvs.js' });
    }

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
