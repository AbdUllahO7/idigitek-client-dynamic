"use client"

import { ReactNode } from "react"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import NavigationTracker from "@/components/NavigationTracker"
import { useLanguage } from "@/contexts/language-context"
import { useWebSite } from "@/lib/webSite/use-WebSite"
import { useSections } from "@/lib/section/use-Section"

// Define TypeScript interfaces for data
interface Website {
  id: string;
  // Add other website properties as needed
}

interface ContentElement {
  _id: string;
  name: string;
  type: string;
  value: string | null;
  // Add other element properties as needed
}

interface Subsection {
  _id: string;
  name: string;
  elements: ContentElement[];
  // Add other subsection properties as needed
}

interface SectionItem {
  _id: string;
  name: string;
  subsections: Subsection[];
  // Add other section item properties as needed
}

interface Section {
  _id: string;
  name: string;
  sectionItems: SectionItem[];
  // Add other section properties as needed
}

interface RootLayoutClientProps {
  children: ReactNode;
}

export default function RootLayoutClient({ children }: RootLayoutClientProps) {
  const { direction } = useLanguage(); // Assume languageId is provided
  const { useGetWebsitesByUserId } = useWebSite();
  const { useGetByWebsiteId } = useSections();

  const { data: websites, isLoading: websitesLoading, error: websitesError } = useGetWebsitesByUserId();
  const websiteId = websites && websites.length > 0 ? websites[0].id : undefined;
  const { data: sectionsData, isLoading: sectionsIsLoading, error: sectionsError } = useGetByWebsiteId(
    websiteId || "",
    false, // includeInactive
    // languageId // Pass languageId for translations
  );


  // Find the Header section
  const headerSection = sectionsData?.data.find((section: Section) => section.name === "Header");
  const headerSectionId = headerSection?._id;

  // Handle loading and error states
  if (websitesLoading || sectionsIsLoading) {
    return <div>Loading...</div>;
  }

  if (websitesError) {
    return <div>Error: {(websitesError as Error).message}</div>;
  }

  if (sectionsError) {
    return <div>Error: {(sectionsError as Error).message}</div>;
  }

  if (!websites || websites.length === 0) {
    return <div>No websites found.</div>;
  }

  return (
    <div dir={direction}>
      <NavigationTracker />
      {headerSectionId ? <Header sectionId={headerSectionId} /> : <Header />}
      {children}
      <Footer />
    </div>
  );
}