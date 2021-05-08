import { InjectionToken, Type } from '@angular/core';

export const DYNAMIC_COMPONENTS = new InjectionToken<DynamicComponent>('dynamic-components');

export interface DynamicComponent {
  selector: string;
  component: Type<unknown>
}
