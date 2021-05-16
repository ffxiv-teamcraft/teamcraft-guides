import { Component, Input } from '@angular/core';
import { Guide } from '../../database/+state/model/guide';
import { GuideCategory } from '../../database/+state/model/guide-category';

@Component({
  selector: 'guides-guide-card',
  templateUrl: './guide-card.component.html',
  styleUrls: ['./guide-card.component.less']
})
export class GuideCardComponent {

  @Input()
  guide: Guide;

  GuideCategory = GuideCategory;

}
