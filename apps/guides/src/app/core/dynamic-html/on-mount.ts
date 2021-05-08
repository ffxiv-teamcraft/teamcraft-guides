export interface OnMount {
  dynamicOnMount(attrs?: Map<string, string>, content?: string, element?: Element): void;
}
