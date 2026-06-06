import { ComponentRef, ElementRef, Injectable, Injector, PLATFORM_ID, Renderer2, ViewContainerRef, inject } from '@angular/core';
import { OnMount } from './on-mount';
import { DYNAMIC_COMPONENTS, DynamicComponent } from './dynamic-component';
import { isPlatformBrowser } from '@angular/common';

export interface DynamicHTMLRef {
  check: () => void;
  destroy: () => void;
}

@Injectable()
export class DynamicHTMLRenderer {
  private components = inject(DYNAMIC_COMPONENTS);
  private platform = inject<Object>(PLATFORM_ID);
  private injector = inject(Injector);
  private renderer = inject(Renderer2);


  private componentRefs = new Map<any, Array<ComponentRef<any>>>();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
  }

  renderInnerHTML(elementRef: ElementRef, html: string, vcr: ViewContainerRef): DynamicHTMLRef {
    if (!isPlatformBrowser(this.platform)) {
      return {
        check: () => {
        },
        destroy: () => {
        }
      };
    }
    elementRef.nativeElement.innerHTML = html.toString();

    const componentRefs: Array<ComponentRef<any>> = [];
    this.components.forEach(({ selector, component }) => {
      const elements = (elementRef.nativeElement as Element).querySelectorAll(selector);
      Array.prototype.forEach.call(elements, (el: Element) => {
        const content = el.innerHTML;
        const cmpRef = vcr.createComponent<any>(component, {
          index: vcr.length,
          injector: this.injector,
          projectableNodes: []
        });

        const hostElement = el as HTMLElement;
        this.renderer.setProperty(hostElement, 'innerHTML', '');
        this.renderer.appendChild(hostElement, cmpRef.location.nativeElement);

        el.removeAttribute('ng-version');

        if (cmpRef.instance.dynamicOnMount) {
          const attrsMap = new Map<string, string>();
          if (el.hasAttributes()) {
            Array.prototype.forEach.call(el.attributes, (attr: Attr) => {
              attrsMap.set(attr.name, attr.value);
            });
          }
          (cmpRef.instance as OnMount).dynamicOnMount(attrsMap, content, el);
        }

        componentRefs.push(cmpRef);
      });
    });
    this.componentRefs.set(elementRef, componentRefs);
    return {
      check: () => componentRefs.forEach(ref => ref.changeDetectorRef.detectChanges()),
      destroy: () => {
        componentRefs.forEach(ref => ref.destroy());
        this.componentRefs.delete(elementRef);
      }
    };
  }
}
