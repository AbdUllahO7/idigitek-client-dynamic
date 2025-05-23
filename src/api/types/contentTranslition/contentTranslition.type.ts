import { ContentElement } from "../contentElements/contentElemetn.type";
import { Language } from "../languages/languages.type";

export interface ContentTranslation {
  _id: string;
  content: string;
  language: string | Language;
  contentElement: string | ContentElement;
  isActive: boolean;
  metadata?: any;
  createdAt?: string;
  updatedAt?: string;
}
