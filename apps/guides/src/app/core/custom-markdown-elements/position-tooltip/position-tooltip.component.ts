import { Component } from '@angular/core';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { PositionComponent } from '../position/position.component';

@Component({
  selector: 'guides-position-tooltip',
  templateUrl: './position-tooltip.component.html',
  styleUrls: ['./position-tooltip.component.less']
})
export class PositionTooltipComponent extends PositionComponent {

  constructor(xivapi: XivapiDataService) {
    super(xivapi);
  }
}
