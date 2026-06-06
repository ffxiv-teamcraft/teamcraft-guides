import { Component, inject } from '@angular/core';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { PositionComponent } from '../position/position.component';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { MapPositionComponent } from '../../components/map-position/map-position.component';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'guides-position-tooltip',
    templateUrl: './position-tooltip.component.html',
    styleUrls: ['./position-tooltip.component.less'],
    imports: [ɵNzTransitionPatchDirective, NzIconDirective, NzTooltipDirective, MapPositionComponent, AsyncPipe]
})
export class PositionTooltipComponent extends PositionComponent {

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);


  constructor() {
    const xivapi = inject(XivapiDataService);

    super(xivapi);
  }
}
