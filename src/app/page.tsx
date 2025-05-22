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

export default function LandingPage() {
  const { direction } = useLanguage()
  const { useGetWebsitesByUserId } = useWebSite()
  const { data, isLoading, error } = useGetWebsitesByUserId()

  // Add smooth scrolling behavior to the document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = ""
    }
  }, [])

  // Log data for debugging
  console.log(data)

  // Get sections from the first website (assuming one website per user)
  const sections = data && data.length > 0 ? data[0].sections : []

  // Map section names to components
  const sectionComponents: { [key: string]: JSX.Element } = {
    Hero: <HeroSection />,
    Services: <ServicesSection />,
    News: <NewsSection />,
    IndustrySolutions: <IndustrySolutionsSection />,
    Features: <FeaturesSection />,
    Projects: <ProjectsSection />,
    Process: <ProcessSection />,
    Team: <TeamSection />,
    Testimonials: <TestimonialsSection />,
    Partners: <PartnersSectionComponent />,
    Faq: <FaqSection />,
    Blog: <BlogSection />,
    Contact: <ContactSection />,
    Cta: <CtaSection />,
    Clients: <ClientsSection />,
    CaseStudies: <CaseStudiesSection />,
    TechnologyStack: <TechnologyStackSection />,
  }

  // Function to check if a section exists
  const hasSection = (sectionName: string) => {
    return sections.some((section: any) => section.name === sectionName)
  }

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {(error as Error).message}</div>
  }

  return (
    <AnimatePresence>
      <div className={`flex min-h-screen flex-col`} dir={direction}>
        <main>
          {hasSection("Hero") && sectionComponents["Hero"]}
          {hasSection("Clients") && sectionComponents["Clients"]}
          {hasSection("Services") && sectionComponents["Services"]}
          {hasSection("News") && sectionComponents["News"]}
          {hasSection("IndustrySolutions") && sectionComponents["IndustrySolutions"]}
          {hasSection("Features") && sectionComponents["Features"]}
          {hasSection("Projects") && sectionComponents["Projects"]}
          {hasSection("Process") && sectionComponents["Process"]}
          {hasSection("Team") && sectionComponents["Team"]}
          {hasSection("CaseStudies") && sectionComponents["CaseStudies"]}
          {hasSection("Testimonials") && sectionComponents["Testimonials"]}
          {hasSection("TechnologyStack") && sectionComponents["TechnologyStack"]}
          {hasSection("Partners") && sectionComponents["Partners"]}
          {hasSection("Faq") && sectionComponents["Faq"]}
          {hasSection("Blog") && sectionComponents["Blog"]}
          {hasSection("Contact") && sectionComponents["Contact"]}
          {hasSection("Cta") && sectionComponents["Cta"]}
        </main>
      </div>
    </AnimatePresence>
  )
}