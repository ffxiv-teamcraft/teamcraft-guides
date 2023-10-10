export interface XivMap {
  id: number;
  placename_id: number;
  placename_sub_id: number;
  size_factor: number;
  offset_x: number;
  offset_y: number;
  image: string;
  name?: {
    de: string;
    en: string;
    fr: string;
    ja: string;
  };
  name_sub?: {
    de: string;
    en: string;
    fr: string;
    ja: string;
  };
}
