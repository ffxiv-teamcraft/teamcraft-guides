import { OnMount } from '../dynamic-html/on-mount';
import { Component, Input, OnChanges } from '@angular/core';

@Component({ template: '' })
export abstract class CustomMarkdownElement implements OnMount, OnChanges {
  @Input()
  preview = false;

  @Input()
  args: string[];

  // Used only when in preview mode, override if needed
  reload(): void {
  }

  dynamicOnMount(attrs?: Map<string, string>, content?: string, element?: Element): void {
    this.args = attrs.get('args')?.split(':') || [];
  }

  ngOnChanges(): void {
    if (this.preview) {
      this.reload();
    }
  }
}
