import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Action } from '../action';

@Component({
  selector: 'guides-xivdb-tooltip-component',
  templateUrl: './xivapi-action-tooltip.component.html',
  styleUrls: ['./xivapi-action-tooltip.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XivapiActionTooltipComponent implements OnInit {

  @Input() action: any;

  details: { name: string, value: any, requiresPipe: boolean }[];

  ngOnInit(): void {
    this.details = [];
    if (this.action.ClassJobLevel) {
      this.details.push({ name: 'Level', value: this.action.ClassJobLevel.toString(), requiresPipe: false });
    }
    if (this.action.PrimaryCostValue) {
      this.details.push({ name: 'Cost', value: this.action.PrimaryCostValue.toString(), requiresPipe: false });
    }
    if (this.action.ClassJobCategory) {
      this.details.push({ name: 'ClassJob', value: this.action.ClassJobCategory.Name_en, requiresPipe: true });
    }
  }

  public getDescription(action: Action): string {
    return action.Description_en;
  }
}
