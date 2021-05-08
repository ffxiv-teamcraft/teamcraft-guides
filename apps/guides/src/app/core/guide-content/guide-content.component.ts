import {
  ChangeDetectionStrategy,
  Component,
  DoCheck,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges
} from '@angular/core';
import { MarkdownService } from 'ngx-markdown';
import { DynamicHTMLRef, DynamicHTMLRenderer } from '../dynamic-html/dynamic-html-renderer';
import { DYNAMIC_COMPONENTS, DynamicComponent } from '../dynamic-html/dynamic-component';

@Component({
  selector: 'guides-guide-content',
  template: '',
  styleUrls: ['./guide-content.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GuideContentComponent implements DoCheck, OnChanges, OnDestroy {

  @Input()
  markdown: string;

  private ref: DynamicHTMLRef = null;

  constructor(private markdownService: MarkdownService,
              private renderer: DynamicHTMLRenderer,
              private elementRef: ElementRef,
              @Inject(DYNAMIC_COMPONENTS) private components: DynamicComponent[]) {
  }

  private prepareCustomElements(html: string): string {
    return this.components.reduce((str, component) => {
      return str.replace(new RegExp(`\\[(${component.selector}):?([^\\]]+)?\\]`, 'gmi'), (match, selector, args) => {
        return `<${selector.toLowerCase()}${args ? ` args="${args}"` : ''}></${selector.toLowerCase()}>`;
      });
    }, html);
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
