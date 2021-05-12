export interface TableOfContentEntry {
  name: string;
  link: string;
  children?: TableOfContentEntry[];
}
