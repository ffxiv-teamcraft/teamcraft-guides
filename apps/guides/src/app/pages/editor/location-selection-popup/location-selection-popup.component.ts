import { Component } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { XivapiDataService } from '../../../core/xivapi/xivapi-data.service';

@Component({
  selector: 'guides-location-selection-popup',
  templateUrl: './location-selection-popup.component.html',
  styleUrls: ['./location-selection-popup.component.less']
})
export class LocationSelectionPopupComponent {

  public maps$ = this.dataService.getMaps([]).pipe(
    map(maps => maps.filter(m => !!m.name)),
    shareReplay(1)
  );

  public form: FormGroup = this.fb.group({
    mapId: [null, Validators.required],
    x: [null, [Validators.required, Validators.min(1), Validators.max(42)]],
    y: [null, [Validators.required, Validators.min(1), Validators.max(42)]],
    tooltip: [false]
  });

  constructor(private fb: FormBuilder, private modalRef: NzModalRef, private dataService: XivapiDataService) {
  }

  submit(): void {
    const raw = this.form.getRawValue();
    this.modalRef.close(`[Position${raw.tooltip ? 'Tooltip' : ''}:${raw.mapId}:${raw.x}:${raw.y}]`);
  }

  cancel(): void {
    this.modalRef.close();
  }
}
