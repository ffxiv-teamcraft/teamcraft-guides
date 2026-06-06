import { Component, inject } from '@angular/core';
import { map, shareReplay } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { XivapiDataService } from '../../../core/xivapi/xivapi-data.service';
import { NzFormDirective, NzFormItemComponent, NzFormLabelComponent, NzFormControlComponent } from 'ng-zorro-antd/form';
import { NzRowDirective, NzColDirective } from 'ng-zorro-antd/grid';
import { NzSpaceCompactItemDirective } from 'ng-zorro-antd/space';
import { NzSelectComponent, NzOptionComponent } from 'ng-zorro-antd/select';
import { NzSpinComponent } from 'ng-zorro-antd/spin';
import { NzInputNumberComponent } from 'ng-zorro-antd/input-number';
import { NzCheckboxComponent } from 'ng-zorro-antd/checkbox';
import { NzDividerComponent } from 'ng-zorro-antd/divider';
import { FlexModule } from '@angular/flex-layout/flex';
import { PositionComponent } from '../../../core/custom-markdown-elements/position/position.component';
import { PositionTooltipComponent } from '../../../core/custom-markdown-elements/position-tooltip/position-tooltip.component';
import { NzEmptyComponent } from 'ng-zorro-antd/empty';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';
import { ɵNzTransitionPatchDirective } from 'ng-zorro-antd/core/transition-patch';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'guides-location-selection-popup',
    templateUrl: './location-selection-popup.component.html',
    styleUrls: ['./location-selection-popup.component.less'],
    imports: [ReactiveFormsModule, NzFormDirective, NzRowDirective, NzFormItemComponent, NzColDirective, NzFormLabelComponent, NzFormControlComponent, NzSpaceCompactItemDirective, NzSelectComponent, NzOptionComponent, NzSpinComponent, NzInputNumberComponent, NzCheckboxComponent, NzDividerComponent, FlexModule, PositionComponent, PositionTooltipComponent, NzEmptyComponent, NzButtonComponent, NzWaveDirective, ɵNzTransitionPatchDirective, AsyncPipe]
})
export class LocationSelectionPopupComponent {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private dataService = inject(XivapiDataService);


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

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  submit(): void {
    const raw = this.form.getRawValue();
    this.modalRef.close(`[Position${raw.tooltip ? 'Tooltip' : ''}:${raw.mapId}:${raw.x}:${raw.y}]`);
  }

  cancel(): void {
    this.modalRef.close();
  }
}
