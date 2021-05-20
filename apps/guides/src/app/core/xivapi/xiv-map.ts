export interface XivMap {
  ID: number;
  PlaceName: {
    Name_en: string;
    Name_fr: string;
    Name_ja: string;
    Name_de: string;
  };
  PlaceNameSub: {
    Name_en: string;
    Name_fr: string;
    Name_ja: string;
    Name_de: string;
  };
  SizeFactor: number;
  OffsetX: number;
  OffsetY: number;
  MapFilename: string;
}
