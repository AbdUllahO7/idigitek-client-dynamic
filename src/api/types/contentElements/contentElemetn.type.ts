import { ContentTranslation } from "../contentTranslition/contentTranslition.type";

export interface ContentElement {
  _id: string;
  name: string;
  type: string;
  defaultContent?: string;
  isActive: boolean;
  metadata?: any;
  order: number;
  parent: string;
  createdAt?: string;
  updatedAt?: string;
  translations?: ContentTranslation[];
  imageUrl?: string 
}