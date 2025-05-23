import { SectionItem } from "../sectionItem/sectionItem.type";

export interface Section  {
  name: string;
  description?: string;
  order?: number;
  image?: string;
  sectionItems?: string[] | SectionItem[];
  WebSiteId: string,
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}