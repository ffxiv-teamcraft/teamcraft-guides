import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Guide } from '../../database/+state/model/guide';
import { GuideCategory } from '../../database/+state/model/guide-category';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'guides-guide-card',
  templateUrl: './guide-card.component.html',
  styleUrls: ['./guide-card.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuideCardComponent {

  @Input()
  guide: Guide;

  @Input()
  large = false;

  GuideCategory = GuideCategory;

  constructor(private sanitizer: DomSanitizer) {
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
