"use client"

import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"
import { CtaBackground } from "./CtaBackground"
import { CtaCard } from "./CtaCard"
import { translationsDataCta } from "../../ConstData/ConstData"


export default function CtaSection() {
  const { ref, isInView } = useScrollAnimation()
  const { direction, language } = useLanguage()
  
  // Get the correct content based on language
  const content = translationsDataCta[language === "ar" ? "ar" : "en"]

  return (
    <section id="demo" className="relative w-full py-12 overflow-hidden" dir={direction}>
      <CtaBackground isInView={isInView} />
      
      <div className="container relative z-10 px-4 md:px-6">
        <CtaCard 
          ref={ref} 
          content={content} 
          isInView={isInView} 
          direction={direction} 
        />
      </div>
    </section>
  )
}
