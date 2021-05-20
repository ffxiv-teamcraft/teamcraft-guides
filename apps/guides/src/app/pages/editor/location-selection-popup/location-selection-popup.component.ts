import { Component } from '@angular/core';
import { map, shareReplay, switchMap } from 'rxjs/operators';
import { XivapiEndpoint, XivapiService } from '@xivapi/angular-client';
import { XivMap } from '../../../core/xivapi/xiv-map';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { XivapiDataService } from '../../../core/xivapi/xivapi-data.service';

@Component({
  selector: 'guides-location-selection-popup',
  templateUrl: './location-selection-popup.component.html',
  styleUrls: ['./location-selection-popup.component.less']
})
export class LocationSelectionPopupComponent {

  public maps$ = this.xivapi.getList<XivMap>(XivapiEndpoint.Map, {
    columns: ['ID'],
    max_items: 1000
  }).pipe(
    switchMap((result) => this.xivapiData.getMaps(result.Results.map(r => r.ID))),
    map(maps => maps.filter(m => !!m.PlaceName)),
    shareReplay(1)
  );

  public form: FormGroup = this.fb.group({
    mapId: [null, Validators.required],
    x: [null, [Validators.required, Validators.min(1), Validators.max(42)]],
    y: [null, [Validators.required, Validators.min(1), Validators.max(42)]],
    tooltip: [false]
  });

  constructor(private xivapi: XivapiService, private fb: FormBuilder,
              private modalRef: NzModalRef, private xivapiData: XivapiDataService) {
  }

  submit(): void {
    const raw = this.form.getRawValue();
    this.modalRef.close(`[Position${raw.tooltip ? 'Tooltip' : ''}:${raw.mapId}:${raw.x}:${raw.y}]`);
  }

  cancel(): void {
    this.modalRef.close();
  }
}
