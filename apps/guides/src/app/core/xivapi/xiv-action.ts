export interface XivAction {
  id: number;
  en: string;
  fr: string;
  ja: string;
  de: string;
  description: {
    en: string;
    fr: string;
    ja: string;
    de: string;
  },
  patch: number;
  icon: string;
}
