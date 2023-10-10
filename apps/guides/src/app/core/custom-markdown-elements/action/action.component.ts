import { Component, Input, OnInit } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { Observable } from 'rxjs';
import { XivAction } from '../../xivapi/xiv-action';
import { tap } from 'rxjs/operators';

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
    this.action$ = this.xivapiData.getActionTooltipData(this.actionId);
  }
}
