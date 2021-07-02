import { Component, Input } from '@angular/core';
import { Guide } from '../../../database/+state/model/guide';

@Component({
  selector: 'guides-guide-banner',
  templateUrl: './guide-banner.component.html',
  styleUrls: ['./guide-banner.component.less']
})
export class GuideBannerComponent {

  @Input()
  guide: Guide;

}
