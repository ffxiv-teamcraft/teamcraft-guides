import { Component, OnInit, inject } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { Observable } from 'rxjs';
import { XivMap } from '../../xivapi/xiv-map';

@Component({
    selector: 'guides-position',
    templateUrl: './position.component.html',
    styleUrls: ['./position.component.less'],
    standalone: false
})
export class PositionComponent extends CustomMarkdownElement implements OnInit {
  private xivapi = inject(XivapiDataService);


  public map$: Observable<XivMap>;

  private mapId: number;
  public x: number;
  public y: number;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.mapId = +this.args[0];
    this.x = +this.args[1];
    this.y = +this.args[2];
    this.map$ = this.xivapi.getMap(this.mapId);
  }

}
