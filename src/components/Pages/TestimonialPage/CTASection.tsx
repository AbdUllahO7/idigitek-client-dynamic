// src/components/Pages/Testimonials/CTASection.jsx
"use client"

import { ButtonSectionLink } from "@/components/SectionLinks"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { ArrowLeft } from "lucide-react"

export const CTASection = ({ t }) => {


    const { language, direction } = useLanguage();
  
  return (
    <section className="bg-muted py-16">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">{t.ctaTitle}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          {t.ctaDescription}
        </p>
        <Button className="bg-gradient-to-tr from-digitek-pink to-digitek-purple text-white">
          {t.contactUs}
        </Button>
      </div>
   
    </section>
  )
}