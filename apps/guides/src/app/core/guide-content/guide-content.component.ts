import { Component, DoCheck, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, PLATFORM_ID, SimpleChanges, ViewContainerRef, inject } from '@angular/core';
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
  private markdownService = inject(MarkdownService);
  private renderer = inject(DynamicHTMLRenderer);
  private elementRef = inject(ElementRef);
  private xivapiData = inject(XivapiDataService);
  private vcr = inject(ViewContainerRef);
  private components = inject(DYNAMIC_COMPONENTS);
  private platform = inject<Object>(PLATFORM_ID);


  @Input()
  markdown: string;

  @Output()
  registerTableOfContents: EventEmitter<TableOfContentEntry[]> = new EventEmitter<TableOfContentEntry[]>();

  private ref: DynamicHTMLRef = null;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    const platform = this.platform;

    if (isPlatformServer(platform)) {
      return;
    }
    this.markdownService.renderer.heading = ({ text, depth }) => {
      const escapedText = text.toLowerCase().replace(/[^\w]+/g, '-');
      return `<h${depth} id="${escapedText}" name="${text}">${text}
          <a class="heading-anchor" onclick="history.replaceState(null, null, '${window.location.pathname}#${escapedText}')">
            #
          </a>
        </h${depth}>`;
    };

    this.markdownService.renderer.paragraph = ({ text }) => {
      const p = text.includes('<img') ? `p class="with-image"` : `p class="clear-both"`;
      return `<${p}>${text}</p>`;
    };

    this.markdownService.renderer.image = ({ href, title, text }) => {
      return `<img alt="${text}" src="${href}" class="md-img"/>`;
    };
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
      return str.replace(new RegExp(`\\[(${component.selector.split('-').join('')})(:[^\\]]+)?\\]`, 'gmi'), (match, selector, argsStr) => {
        const htmlSelector = component.selector.replace(/([A-Z])/g, ' $1').split(' ').join('-').toLowerCase();
        const args = argsStr.split(':').slice(1);
        if (component.contentLoader) {
          loadingQueue[component.contentLoader].push(component.getId(args));
        }
        return `<${htmlSelector}${args ? ` args="${args.join(':')}"` : ''}></${htmlSelector.toLowerCase()}>`;
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
      const parsed = this.markdownService.parse(this.markdown);
      const promise = typeof parsed === 'string' ? Promise.resolve(parsed) : parsed;
      promise.then(parsedMarkdown => {
        const content = this.prepareCustomElements(((parsedMarkdown as any)?.toString() || parsedMarkdown as string).replace(/<script/, ''));
        const titleRegexp = /<h([1-3]) id="([\w-]+)" name="([^"]+)">/gmi;
        const tableOfContents: TableOfContentEntry[] = [];
        let title;
        const lastTitles: Record<number, TableOfContentEntry> = {
          1: null,
          2: null
        };
        while ((title = titleRegexp.exec(content)) !== null) {
          const [, level, link, name] = title;
          if (link.includes('changelog')) {
            continue;
          }
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
        this.ref = this.renderer.renderInnerHTML(this.elementRef, content, this.vcr);
        setTimeout(() => {
          this.registerTableOfContents.emit(tableOfContents);
        });
      });
    } else {
      this.ref = this.renderer.renderInnerHTML(this.elementRef, '', this.vcr);
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
