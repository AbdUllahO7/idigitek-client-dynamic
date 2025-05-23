import { Section } from "../section/section.type";
import { SubSection } from "../subSection/subSection.type";

export interface SectionItem {
  _id: string;
  name: string;
  description?: string;
  image?: string | null;
  isActive: boolean;
  order: number;
  isMain: boolean;
  section: string | Section;
  WebSiteId : string,
  subsections?: string[] | SubSection[];
  subsectionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface Service extends SectionItem {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
  isMain: boolean;
  order: number;
  subsections?: any[];
}

