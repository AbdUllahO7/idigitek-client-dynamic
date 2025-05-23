import { ContentElement } from "../contentElements/contentElemetn.type";
import { Language } from "../languages/languages.type";
import { SectionItem } from "../sectionItem/sectionItem.type";

export interface SubSection {
  _id: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  order: number;
  sectionItem?: string | SectionItem;
  languages: string[] | Language[];
  metadata?: any;
  defaultContent : string
  contentElements?: ContentElement[];
  contentCount?: number;
  createdAt?: string;
  updatedAt?: string;
  isMain?: boolean;
  parentSections?: string[];
  section?:SubSection | string,
  elements?: ContentElement[];
  WebSiteId :string, 
}