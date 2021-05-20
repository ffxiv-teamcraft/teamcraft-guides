import { Component, Input, OnInit } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { Observable } from 'rxjs';
import { XivapiEndpoint } from '@xivapi/angular-client';
import { XivAction } from '../../xivapi/xiv-action';

@Component({
  selector: 'guides-action',
  templateUrl: './action.component.html',
  styleUrls: ['./action.component.less']
})
export class ActionComponent extends CustomMarkdownElement implements OnInit {

  public action$: Observable<XivAction>;

  @Input()
  action: number;

  get actionId(): number {
    if (this.args) {
      return +this.args[0];
    } else {
      return this.action;
    }
  }

  constructor(private xivapiData: XivapiDataService) {
    super();
  }

  ngOnInit(): void {
    if (this.actionId >= 100000) {
      this.action$ = this.xivapiData.get<XivAction>(XivapiEndpoint.CraftAction, this.actionId);
    } else {
      this.action$ = this.xivapiData.get<XivAction>(XivapiEndpoint.Action, this.actionId);
    }
  }
}
