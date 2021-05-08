import { Type } from '@angular/core';

export interface ComponentWithSelector {
  selector: string;
  component: Type<unknown>;
}
