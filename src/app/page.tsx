"use client"

import { JSX, useEffect } from "react"
import ServicesSection from "@/components/Pages/Home/sections/services-section"
import ProcessSection from "@/components/Pages/Home/sections/process-section"
import TestimonialsSection from "@/components/Pages/Home/sections/testimonials-section"
import TechnologyStackSection from "@/components/Pages/Home/sections/technology-stack-section"
import PartnersSectionComponent from "@/components/Pages/Home/sections/partners-section"
import TeamSection from "@/components/Pages/Home/sections/team-section"
import { AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import NewsSection from "@/components/Pages/Home/sections/news-section"
import ProjectsSection from "@/components/Pages/Home/sections/projects-section"
import ClientsSection from "@/components/Pages/Home/sections/ClientsSection/clients-section"
import BlogSection from "@/components/Pages/Home/sections/BlogSection/blog-section"
import ContactSection from "@/components/Pages/Home/sections/ContactSection/contact-section"
import CtaSection from "@/components/Pages/Home/sections/CtaSection/cta-section"
import CaseStudiesSection from "@/components/Pages/Home/sections/CaseStudiesSection/case-studies-section"
import FaqSection from "@/components/Pages/Home/sections/FaqSection/faq-section"
import HeroSection from "@/components/Pages/Home/sections/HeroSection/hero-section"
import IndustrySolutionsSection from "@/components/Pages/Home/sections/IndustrySolutionsSection/industry-solutions-section"
import FeaturesSection from "@/components/Pages/Home/sections/FeaturesSection/features-section"
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

export default function LandingPage() {
  const { direction } = useLanguage(); // Note: languageId is missing; add if needed for translations
  const { useGetWebsitesByUserId } = useWebSite();
  const { useGetByWebsiteId } = useSections();

  const { data: websites, isLoading: websitesLoading, error: websitesError } = useGetWebsitesByUserId();
  const websiteId = websites && websites.length > 0 ? websites[0].id : undefined;
  const { data: sectionsData, isLoading: sectionsIsLoading, error: sectionsError } = useGetByWebsiteId(
    websiteId || "",
    false, // includeInactive
    // Add languageId here if available, e.g., languageId
  );

  // Add smooth scrolling behavior to the document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // Map section names to components with section ID
  const sectionComponents: { [key: string]: (id: string) => JSX.Element } = {
    // Hero: (id: string) => <HeroSection id={id} />,
    // Services: (id: string) => <ServicesSection id={id} />,
    News: (id: string) => <NewsSection websiteId = {websiteId} sectionId={id} />,
    // IndustrySolutions: (id: string) => <IndustrySolutionsSection id={id} />,
    // Features: (id: string) => <FeaturesSection id={id} />,
    // Projects: (id: string) => <ProjectsSection id={id} />,
    // Process: (id: string) => <ProcessSection id={id} />,
    // Team: (id: string) => <TeamSection id={id} />,
    // Testimonials: (id: string) => <TestimonialsSection id={id} />,
    // Partners: (id: string) => <PartnersSectionComponent id={id} />,
    // Faq: (id: string) => <FaqSection id={id} />,
    // Blog: (id: string) => <BlogSection id={id} />,
    // Contact: (id: string) => <ContactSection id={id} />,
    // Cta: (id: string) => <CtaSection id={id} />,
    // Clients: (id: string) => <ClientsSection id={id} />,
    // CaseStudies: (id: string) => <CaseStudiesSection id={id} />,
    // TechnologyStack: (id: string) => <TechnologyStackSection id={id} />,
  };

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

  if (!sectionsData.data || sectionsData.data.length === 0) {
    return <div>No sections found for the website.</div>;
  }

  return (
    <AnimatePresence>
      <div className="flex min-h-screen flex-col" dir={direction}>
        <main>
          {sectionsData.data.map((section: Section) => (
            sectionComponents[section.name]?.(section._id) || null
          ))}
        </main>
      </div>
    </AnimatePresence>
  );
}