import { DYNAMIC_COMPONENTS, DynamicComponent } from '../dynamic-html/dynamic-component';
import { ActionComponent } from './action/action.component';
import { ListComponent } from './list/list.component';
import { RotationComponent } from './rotation/rotation.component';

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
]
