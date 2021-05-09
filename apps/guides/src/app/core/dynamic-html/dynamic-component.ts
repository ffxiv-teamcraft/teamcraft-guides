import { InjectionToken, Type } from '@angular/core';
import { XivapiDataService } from '../xivapi/xivapi-data.service';

export const DYNAMIC_COMPONENTS = new InjectionToken<DynamicComponent>('dynamic-components');

export interface DynamicComponent {
  selector: string;
  component: Type<unknown>;
  contentLoader: keyof XivapiDataService;
  getId: (args: string[]) => number;
}
