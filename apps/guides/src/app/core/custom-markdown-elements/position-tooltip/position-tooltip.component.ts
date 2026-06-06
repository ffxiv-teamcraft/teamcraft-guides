import { Component, inject } from '@angular/core';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { PositionComponent } from '../position/position.component';

@Component({
    selector: 'guides-position-tooltip',
    templateUrl: './position-tooltip.component.html',
    styleUrls: ['./position-tooltip.component.less'],
    standalone: false
})
export class PositionTooltipComponent extends PositionComponent {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const xivapi = inject(XivapiDataService);

    super(xivapi);
  }
}
