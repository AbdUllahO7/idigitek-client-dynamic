"use client"

import { useEffect } from "react"
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

export default function LandingPage() {
  const { direction } = useLanguage()

  // Add smooth scrolling behavior to the document
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = ""
    }
  }, [])

  return (
    <AnimatePresence>
      <div className={`flex min-h-screen flex-col`} dir={direction}>
        <main>
            <HeroSection />
            {/* <ClientsSection /> */}
            <ServicesSection /> 
            <NewsSection/>
            <IndustrySolutionsSection />
            <FeaturesSection />
            <ProjectsSection/>  
            <ProcessSection />
            <TeamSection />
            {/* <CaseStudiesSection /> */}
            <TestimonialsSection />
            {/* <TechnologyStackSection /> */}
            <PartnersSectionComponent />
            <FaqSection />
            <BlogSection />
            <ContactSection />
            <CtaSection />
        </main>
      </div>
    </AnimatePresence>
  )
}

