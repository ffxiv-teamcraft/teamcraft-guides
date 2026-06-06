import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { XivMap } from '../../xivapi/xiv-map';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { NzIconDirective } from 'ng-zorro-antd/icon';
import { NzTooltipDirective } from 'ng-zorro-antd/tooltip';
import { NgStyle, DecimalPipe } from '@angular/common';
import { ExtendedModule } from '@angular/flex-layout/extended';

@Component({
    selector: 'guides-map-position',
    templateUrl: './map-position.component.html',
    styleUrls: ['./map-position.component.less'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ɵNzTransitionPatchDirective, NzIconDirective, NzTooltipDirective, NgStyle, ExtendedModule, DecimalPipe]
})
export class MapPositionComponent {

  @Input()
  map: XivMap;

  @Input()
  x: number;

  @Input()
  y: number;

  getMarkerStyle(): Record<string, string> {
    const scale = this.map.size_factor / 100;

    const offset = 1;

    // 20.48 is 2048 / 100, so we get percents in the end.
    const x = (this.x - offset) * 50 * scale / 20.48;
    const y = (this.y - offset) * 50 * scale / 20.48;
    return {
      top: `${y}%`,
      left: `${x}%`
    };
  }

}
