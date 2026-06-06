import { Component, Input, OnInit, inject } from '@angular/core';
import { CustomMarkdownElement } from '../custom-markdown-element';
import { XivapiDataService } from '../../xivapi/xivapi-data.service';
import { Observable } from 'rxjs';
import { XivAction } from '../../xivapi/xiv-action';
import { tap } from 'rxjs/operators';
import { XivapiActionTooltipDirective } from '../../xivapi/xivapi-action-tooltip/xivapi-action-tooltip.directive';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'guides-action',
    templateUrl: './action.component.html',
    styleUrls: ['./action.component.less'],
    imports: [XivapiActionTooltipDirective, AsyncPipe]
})
export class ActionComponent extends CustomMarkdownElement implements OnInit {
  private xivapiData = inject(XivapiDataService);


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

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.action$ = this.xivapiData.getActionTooltipData(this.actionId);
  }
}
