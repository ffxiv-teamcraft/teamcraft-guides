import { AfterContentInit, Component, PLATFORM_ID, inject } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { delay, first, map, startWith, switchMapTo, tap } from 'rxjs/operators';
import { GuidesFacade } from '../../../database/+state/guides.facade';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DOCUMENT, isPlatformBrowser, Location, NgIf, NgFor, AsyncPipe, DatePipe } from '@angular/common';
import { AuthService } from '../../../database/auth.service';
import { Guide } from '../../../database/+state/model/guide';
import { TableOfContentEntry } from '../../../core/guide-content/table-of-content-entry';
import { SeoComponent } from '../../../core/seo/seo-component';
import { Meta, Title } from '@angular/platform-browser';
import { SeoMetaConfig } from '../../../core/seo/seo-meta-config';
import { Clipboard } from '@angular/cdk/clipboard';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FlexModule } from '@angular/flex-layout/flex';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { GuideBannerComponent } from '../../../core/components/guide-banner/guide-banner.component';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { GuideContentComponent } from '../../../core/guide-content/guide-content.component';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { ExtendedModule } from '@angular/flex-layout/extended';
import { NzAnchorComponent, NzAnchorLinkComponent } from 'ng-zorro-antd/anchor';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { CharacterPipe } from '../../../core/pipes/character.pipe';
import { IfMobilePipe } from '../../../core/pipes/if-mobile.pipe';

@Component({
    selector: 'guides-guide',
    templateUrl: './guide.component.html',
    styleUrls: ['./guide.component.less'],
    imports: [NgIf, FlexModule, NzDividerComponent, GuideBannerComponent, NzSpinComponent, NgFor, GuideContentComponent, NzSpaceCompactItemDirective, NzButtonComponent, ɵNzTransitionPatchDirective, NzTooltipDirective, NzIconDirective, ExtendedModule, RouterLink, NzAnchorComponent, NzAnchorLinkComponent, NzEmptyComponent, AsyncPipe, DatePipe, CharacterPipe, IfMobilePipe]
})
export class GuideComponent extends SeoComponent implements AfterContentInit {
  private guidesFacade = inject(GuidesFacade);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private platform = inject<Object>(PLATFORM_ID);
  private document = inject<Document>(DOCUMENT);
  private location = inject(Location);
  private message = inject(NzMessageService);
  private clipboard = inject(Clipboard);


  public guide$: Observable<Guide> = this.route.paramMap.pipe(
    map(params => params.get('slug')),
    tap((slug: string) => {
      this.guidesFacade.select(slug);
    }),
    switchMapTo(this.guidesFacade.selectedGuides$)
  );

  public loading$ = this.guidesFacade.loading$;

  public isEditor$ = combineLatest([this.guide$, this.authService.user$]).pipe(
    map(([guide, user]) => {
      return user?.admin || user?.moderator || user?.$key === guide.author || (guide.contributors || []).includes(user?.$key);
    })
  );

  public tableOfContents$ = new Subject<TableOfContentEntry[]>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const meta = inject(Meta);
    const title = inject(Title);

    super(meta, title);
    this.guidesFacade.init();
  }

  ngAfterContentInit(): void {
    if (isPlatformBrowser(this.platform)) {
      combineLatest([this.route.fragment.pipe(startWith(null)), this.tableOfContents$]).pipe(
        first(),
        delay(1000)
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

  copyPath(): void {
    if (this.clipboard.copy(`https://guides.ffxivteamcraft.com${this.location.path()}`)) {
      this.message.success('Share link copied to your clipboard');
    } else {
      this.message.error('Failed to share link to your clipboard');
    }
  }

  protected getMeta$(): Observable<SeoMetaConfig> {
    return this.guide$.pipe(
      map(guide => {
        return {
          title: guide.title,
          description: guide.description,
          banner: guide.banner || 'https://guides.ffxivteamcraft.com/assets/media/banner_placeholder.png',
          url: `https://guides.ffxivteamcraft.com${this.location.path(true)}`
        };
      })
    );
  }

}
