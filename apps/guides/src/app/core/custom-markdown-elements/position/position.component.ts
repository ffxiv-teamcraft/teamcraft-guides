import { Component, OnInit } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { Observable } from 'rxjs';
import { XivMap } from '../../xivapi/xiv-map';
import { XivapiEndpoint } from '@xivapi/angular-client';

@Component({
  selector: 'guides-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.less']
})
export class PositionComponent extends CustomMarkdownElement implements OnInit {

  public map$: Observable<XivMap>;

  private mapId: number;
  public x: number;
  public y: number;

  constructor(private xivapi: XivapiDataService) {
    super();
  }

  ngOnInit(): void {
    this.reload();
  }

  reload() {
    this.mapId = +this.args[0];
    this.x = +this.args[1];
    this.y = +this.args[2];
    this.map$ = this.xivapi.get<XivMap>(XivapiEndpoint.Map, this.mapId);
  }

}
