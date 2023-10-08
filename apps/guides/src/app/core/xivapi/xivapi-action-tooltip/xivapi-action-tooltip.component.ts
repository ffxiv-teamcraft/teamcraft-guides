import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { jobAbbrs } from '../job-abbr-en';

@Component({
  selector: 'guides-xivdb-tooltip-component',
  templateUrl: './xivapi-action-tooltip.component.html',
  styleUrls: ['./xivapi-action-tooltip.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class XivapiActionTooltipComponent implements OnInit {

  @Input() action: any;

  details: { name: string, value: any }[];

  ngOnInit(): void {
    this.details = [];
    if (this.action.level) {
      this.details.push({ name: 'Level', value: this.action.level.toString() });
    }
    if (this.action.primaryCostValue) {
      this.details.push({ name: 'Cost', value: this.action.primaryCostValue.toString() });
    }
    if (this.action.job) {
      this.details.push({
        name: 'Class/Job',
        value: jobAbbrs[this.action.job]
      });
    }
  }
}
