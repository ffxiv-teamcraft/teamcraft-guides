import {
  Component,
  DoCheck,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  PLATFORM_ID,
  SimpleChanges
} from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { DynamicHTMLRef, DynamicHTMLRenderer } from '../dynamic-html/dynamic-html-renderer';
import { DYNAMIC_COMPONENTS, DynamicComponent } from '../dynamic-html/dynamic-component';
import { XivapiDataService } from '../xivapi/xivapi-data.service';
import { isPlatformServer } from '@angular/common';
import { TableOfContentEntry } from './table-of-content-entry';

@Component({
  selector: 'guides-guide-content',
  template: '',
  styleUrls: ['./guide-content.component.less']
})
export class GuideContentComponent implements DoCheck, OnChanges, OnDestroy {

  @Input()
  markdown: string;

  @Output()
  registerTableOfContents: EventEmitter<TableOfContentEntry[]> = new EventEmitter<TableOfContentEntry[]>();

  private ref: DynamicHTMLRef = null;

  constructor(private markdownService: MarkdownService,
              private renderer: DynamicHTMLRenderer,
              private elementRef: ElementRef,
              private xivapiData: XivapiDataService,
              @Inject(DYNAMIC_COMPONENTS) private components: DynamicComponent[],
              @Inject(PLATFORM_ID) private platform: Object) {
    this.markdownService.renderer.heading = (text: string, level: number) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${level} id="${escapedText}" name="${text}">${text}
          <a class="heading-anchor" onclick="window.location.hash = '${escapedText}'">
            #
          </a>
        </h${level}>`;
    };

    this.markdownService.renderer.paragraph = (text: string) => {
      const p = text.includes('<img') ? `p class="with-image"`: `p class="clear-both"`;
      return `<${p}>${text}</p>`;
    };

    this.markdownService.renderer.image = (href, title, text) => {
      return `<img alt="${text}" src="${href}" class="md-img"/>`
    }
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
      const content = this.prepareCustomElements(this.markdownService.compile(this.markdown).replace(/<script/, ''));
      const titleRegexp = /<h([1-3]) id="([\w-]+)" name="([^"]+)">/gmi;
      const tableOfContents: TableOfContentEntry[] = [];
      let title;
      const lastTitles: Record<number, TableOfContentEntry> = {
        1: null,
        2: null
      };
      while ((title = titleRegexp.exec(content)) !== null) {
        const [, level, link, name] = title;
        const entry = {
          name,
          link: `#${link}`,
          children: []
        };
        switch (+level) {
          case 1:
            tableOfContents.push(entry);
            lastTitles[1] = entry;
            break;
          case 2:
            if (!lastTitles[1]) {
              tableOfContents.push(entry);
            } else {
              lastTitles[1].children.push(entry);
            }
            lastTitles[2] = entry;
            break;
          case 3:
            if (!lastTitles[2]) {
              tableOfContents.push(entry);
            } else {
              lastTitles[2].children.push(entry);
            }
            break;
        }
      }
      this.ref = this.renderer.renderInnerHTML(this.elementRef, content);
      setTimeout(() => {
        this.registerTableOfContents.emit(tableOfContents);
      });
    } else {
      this.ref = this.renderer.renderInnerHTML(this.elementRef, '');
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
