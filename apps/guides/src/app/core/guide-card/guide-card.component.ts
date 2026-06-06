import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { Guide } from '../../database/+state/model/guide';
import { GuideCategory } from '../../database/+state/model/guide-category';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { FlexModule } from '@angular/flex-layout/flex';
import { GuideBannerComponent } from '../components/guide-banner/guide-banner.component';
import { NzAvatarComponent } from 'ng-zorro-antd/avatar';
import { AsyncPipe } from '@angular/common';
import { CharacterPipe } from '../pipes/character.pipe';
import { IfMobilePipe } from '../pipes/if-mobile.pipe';

@Component({
    selector: 'guides-guide-card',
    templateUrl: './guide-card.component.html',
    styleUrls: ['./guide-card.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink, FlexModule, GuideBannerComponent, NzAvatarComponent, AsyncPipe, CharacterPipe, IfMobilePipe]
})
export class GuideCardComponent {
  private sanitizer = inject(DomSanitizer);


  @Input()
  guide: Guide;

  @Input()
  large = false;

  GuideCategory = GuideCategory;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  getIcon(category: GuideCategory): SafeHtml {
    switch (category) {
      case GuideCategory.Crafting:
        return this.sanitizer.bypassSecurityTrustHtml('&#x0F008;');
      case GuideCategory.Gathering:
        return this.sanitizer.bypassSecurityTrustHtml('&#x0F120;');
      case GuideCategory.Other:
        return this.sanitizer.bypassSecurityTrustHtml('&#x0F159;');
      default:
        return this.sanitizer.bypassSecurityTrustHtml('');
    }
  }
}
