import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { XivMap } from '../../xivapi/xiv-map';

@Component({
  selector: 'guides-map-position',
  templateUrl: './map-position.component.html',
  styleUrls: ['./map-position.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapPositionComponent {

  @Input()
  map: XivMap;

  @Input()
  x: number;

  @Input()
  y: number;

  getMarkerStyle(): Record<string, string> {
    const scale = this.map.SizeFactor / 100;

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
