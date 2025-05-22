// types.ts

export interface FaqItem {
    question: string;
    answer: string;
    category: string;
  }
  
  export interface FaqContent {
    badge: string;
    heading: string;
    subheading: string;
    searchPlaceholder: string;
    stillHaveQuestions: string;
    supportMessage: string;
    contactButton: string;
    faqs: FaqItem[];
  }
  
  export interface FaqItemProps {
    faq: FaqItem;
    index: number;
    isInView: boolean;
    isRTL: boolean;
  }
  
  export interface FaqHeaderProps {
    content: FaqContent;
    isInView: boolean;
    isRTL: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
  }
  
  export interface CategoryFiltersProps {
    categories: string[];
    isInView: boolean;
  }
  
  export interface ContactCtaProps {
    content: FaqContent;
    isInView: boolean;
    isRTL: boolean;
  }