"use client";

import { JSX, useEffect } from "react";
import ServicesSection from "@/components/Pages/Home/sections/services-section";
import ProcessSection from "@/components/Pages/Home/sections/process-section";
import TestimonialsSection from "@/components/Pages/Home/sections/testimonials-section";
import TechnologyStackSection from "@/components/Pages/Home/sections/technology-stack-section";
import PartnersSectionComponent from "@/components/Pages/Home/sections/partners-section";
import TeamSection from "@/components/Pages/Home/sections/team-section";
import { AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/language-context";
import NewsSection from "@/components/Pages/Home/sections/news-section";
import ProjectsSection from "@/components/Pages/Home/sections/projects-section";
import ClientsSection from "@/components/Pages/Home/sections/ClientsSection/clients-section";
import BlogSection from "@/components/Pages/Home/sections/BlogSection/blog-section";
import ContactSection from "@/components/Pages/Home/sections/ContactSection/contact-section";
import CtaSection from "@/components/Pages/Home/sections/CtaSection/cta-section";
import CaseStudiesSection from "@/components/Pages/Home/sections/CaseStudiesSection/case-studies-section";
import FaqSection from "@/components/Pages/Home/sections/FaqSection/faq-section";
import HeroSection from "@/components/Pages/Home/sections/HeroSection/hero-section";
import IndustrySolutionsSection from "@/components/Pages/Home/sections/IndustrySolutionsSection/industry-solutions-section";
import FeaturesSection from "@/components/Pages/Home/sections/FeaturesSection/features-section";
import { useWebSite } from "@/lib/webSite/use-WebSite";
import { useSections } from "@/lib/section/use-Section";

// Define TypeScript interfaces for data
interface Website {
  id: string;
}

interface ContentElement {
  _id: string;
  name: string;
  type: string;
  value: string | null;
}

interface Subsection {
  _id: string;
  name: string;
  elements: ContentElement[];
}

interface SectionItem {
  _id: string;
  name: string;
  subName: string;
  subsections: Subsection[];
}

interface Section {
  _id: string;
  name: string;
  subName: string;
  order: number;
  sectionItems: SectionItem[];
}

export default function LandingPage() {
  const { direction } = useLanguage();
  const { useGetWebsitesByUserId } = useWebSite();
  const { useGetByWebsiteId } = useSections();

  const { data: websites, isLoading: websitesLoading, error: websitesError } = useGetWebsitesByUserId();
  const websiteId = websites && websites.length > 0 ? websites[0].id : undefined;
  const { data: sectionsData, isLoading: sectionsIsLoading, error: sectionsError } = useGetByWebsiteId(
    websiteId || "",
    false,
  );

  localStorage.setItem("websiteId", websiteId || "");

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
    return () => {
      document.documentElement.style.scrollBehavior = "";
    };
  }, []);

  // Map section names to components with section ID
  const sectionComponents: { [key: string]: (id: string, websiteId?: string) => JSX.Element } = {
    Hero: (id: string, websiteId?: string) => <HeroSection websiteId={websiteId} sectionId={id} />,
    News: (id: string, websiteId?: string) => <NewsSection websiteId={websiteId} sectionId={id} />,
    IndustrySolutions: (id: string, websiteId?: string) => (
      <IndustrySolutionsSection websiteId={websiteId} sectionId={id} />
    ),
    // Contact: (id: string, websiteId?: string) => <ContactSection websiteId={websiteId} sectionId={id} />,
    // // Add other sections as needed
    // Services: (id: string, websiteId?: string) => <ServicesSection websiteId={websiteId} sectionId={id} />,
    // Features: (id: string, websiteId?: string) => <FeaturesSection websiteId={websiteId} sectionId={id} />,
    // Projects: (id: string, websiteId?: string) => <ProjectsSection websiteId={websiteId} sectionId={id} />,
    // Process: (id: string, websiteId?: string) => <ProcessSection websiteId={websiteId} sectionId={id} />,
    // Team: (id: string, websiteId?: string) => <TeamSection websiteId={websiteId} sectionId={id} />,
    // Testimonials: (id: string, websiteId?: string) => (
    //   <TestimonialsSection websiteId={websiteId} sectionId={id} />
    // ),
    // Partners: (id: string, websiteId?: string) => <PartnersSectionComponent websiteId={websiteId} sectionId={id} />,
    // Faq: (id: string, websiteId?: string) => <FaqSection websiteId={websiteId} sectionId={id} />,
    // Blog: (id: string, websiteId?: string) => <BlogSection websiteId={websiteId} sectionId={id} />,
    // Cta: (id: string, websiteId?: string) => <CtaSection websiteId={websiteId} sectionId={id} />,
    // Clients: (id: string, websiteId?: string) => <ClientsSection websiteId={websiteId} sectionId={id} />,
    // CaseStudies: (id: string, websiteId?: string) => <CaseStudiesSection websiteId={websiteId} sectionId={id} />,
    // TechnologyStack: (id: string, websiteId?: string) => (
    //   <TechnologyStackSection websiteId={websiteId} sectionId={id} />
    // ),
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

  // Separate footer section (e.g., Contact) and sort other sections by order
  const footerSectionName = "Contact"; // Adjust if your footer is named differently, e.g., "Cta"
  const footerSection = sectionsData.data.find(
    (section: Section) => section.subName === footerSectionName
  );
  const nonFooterSections = sectionsData.data
    .filter((section: Section) => section.subName !== footerSectionName)
    .sort((a: Section, b: Section) => a.order - b.order);

  return (
    <AnimatePresence>
      <div className="flex min-h-screen flex-col" dir={direction}>
        <main>
          {/* Render sorted non-footer sections */}
          {nonFooterSections.map((section: Section) =>
            sectionComponents[section.subName]?.(section._id, websiteId) || null
          )}
          {/* Always render footer section last */}
          {footerSection && sectionComponents[footerSection.subName]?.(footerSection._id, websiteId)}
        </main>
      </div>
    </AnimatePresence>
  );
}