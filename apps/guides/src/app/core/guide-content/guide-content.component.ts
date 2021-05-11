import {
  Component,
  DoCheck,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { DynamicHTMLRef, DynamicHTMLRenderer } from '../dynamic-html/dynamic-html-renderer';
import { DYNAMIC_COMPONENTS, DynamicComponent } from '../dynamic-html/dynamic-component';
import { XivapiDataService } from '../xivapi/xivapi-data.service';
import { isPlatformServer } from '@angular/common';

@Component({
  selector: 'guides-guide-content',
  template: '',
  styleUrls: ['./guide-content.component.less']
})
export class GuideContentComponent implements DoCheck, OnChanges, OnDestroy {

  @Input()
  markdown: string;

  private ref: DynamicHTMLRef = null;

  constructor(private markdownService: MarkdownService,
              private renderer: DynamicHTMLRenderer,
              private elementRef: ElementRef,
              private xivapiData: XivapiDataService,
              @Inject(DYNAMIC_COMPONENTS) private components: DynamicComponent[],
              @Inject(PLATFORM_ID) private platform: Object) {
  }

  private prepareCustomElements(html: string): string {
    if (isPlatformServer(this.platform)) {
      return html;
    }
    const loadingQueue: Partial<Record<keyof XivapiDataService, number[]>> = {};
    const transformed = this.components.reduce((str, component) => {
      if (component.contentLoader) {
        loadingQueue[component.contentLoader] = loadingQueue[component.contentLoader] || [];
      }
      return str.replace(new RegExp(`\\[(${component.selector}):?([^\\]]+)?\\]`, 'gmi'), (match, selector, args) => {
        if (component.contentLoader) {
          loadingQueue[component.contentLoader].push(component.getId(args.split(':')));
        }
        return `<${selector.toLowerCase()}${args ? ` args="${args}"` : ''}></${selector.toLowerCase()}>`;
      });
    }, html);
    Object.entries<number[]>(loadingQueue).forEach(([method, ids]) => {
      this.xivapiData[method](ids).subscribe();
    });
    return transformed;
  }

  ngOnChanges(_: SimpleChanges) {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
    if (this.markdown && this.elementRef) {
      const content = this.prepareCustomElements(this.markdownService.compile(this.markdown));
      this.ref = this.renderer.renderInnerHTML(this.elementRef, content);
    }
  }

  ngDoCheck() {
    if (this.ref) {
      this.ref.check();
    }
  }

  ngOnDestroy() {
    if (this.ref) {
      this.ref.destroy();
      this.ref = null;
    }
  }

}
