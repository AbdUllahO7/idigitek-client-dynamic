"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import SectionBackground from "./SectionBackground"
import SectionHeader from "./SectionHeader"
import IndustriesGrid from "./IndustriesGrid"
import { translationsDataIndustry } from "../../ConstData/ConstData"


export default function IndustrySolutionsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { language, direction } = useLanguage()

  // Get the current language content
  const content = translationsDataIndustry[language] || translationsDataIndustry['en']

  return (
    <section id="industry" className="relative w-full py-12 overflow-hidden" dir={direction}>
      {/* Background elements */}
      <SectionBackground />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <SectionHeader
            isInView={isInView}
            sectionTitle={content.industryTitle}
            mainTitle={content.mainTitle}
            mainDescription={content.mainDescription}
          />
        </div>

        <IndustriesGrid 
          industries={content.industries} 
          isInView={isInView} 
        />
      </div>
    </section>
  )
}