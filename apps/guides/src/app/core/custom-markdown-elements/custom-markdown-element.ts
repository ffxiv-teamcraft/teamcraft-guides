import { OnMount } from '../dynamic-html/on-mount';

export abstract class CustomMarkdownElement implements OnMount {
  args: string[];

  dynamicOnMount(attrs?: Map<string, string>, content?: string, element?: Element): void {
    this.args = attrs.get('args').split(':');
  }
}
