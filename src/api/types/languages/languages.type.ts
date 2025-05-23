import { SubSection } from "../subSection/subSection.type";

export interface Language  {
  _id:string
  language: string;
  languageID: string;
  isActive: boolean;
  subSections: string[] | SubSection[];
  createdAt?: string;
  updatedAt?: string;
  websiteId : string,
}