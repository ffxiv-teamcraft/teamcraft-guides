import { DYNAMIC_COMPONENTS, DynamicComponent } from '../dynamic-html/dynamic-component';
import { ActionComponent } from './action/action.component';
import { ListComponent } from './list/list.component';
import { RotationComponent } from './rotation/rotation.component';
import { PositionComponent } from './position/position.component';
import { PositionTooltipComponent } from './position-tooltip/position-tooltip.component';
import { GearsetComponent } from './gearset/gearset.component';

export const CUSTOM_MARKDOWN_ELEMENTS = [
  {
    provide: DYNAMIC_COMPONENTS,
    useValue: {
      selector: 'action',
      component: ActionComponent,
      contentLoader: 'getActions',
      getId: args => +args[0]
    } as DynamicComponent,
    multi: true
  },
  {
    provide: DYNAMIC_COMPONENTS,
    useValue: {
      selector: 'list',
      component: ListComponent
    } as DynamicComponent,
    multi: true
  },
  {
    provide: DYNAMIC_COMPONENTS,
    useValue: {
      selector: 'rotation',
      component: RotationComponent
    } as DynamicComponent,
    multi: true
  },
  {
    provide: DYNAMIC_COMPONENTS,
    useValue: {
      selector: 'gearset',
      component: GearsetComponent
    } as DynamicComponent,
    multi: true
  },
  {
    provide: DYNAMIC_COMPONENTS,
    useValue: {
      selector: 'position',
      component: PositionComponent,
      contentLoader: 'getMaps',
      getId: args => +args[0]
    } as DynamicComponent,
    multi: true
  },
  {
    provide: DYNAMIC_COMPONENTS,
    useValue: {
      selector: 'position-tooltip',
      component: PositionTooltipComponent,
      contentLoader: 'getMaps',
      getId: args => +args[0]
    } as DynamicComponent,
    multi: true
  }
];
