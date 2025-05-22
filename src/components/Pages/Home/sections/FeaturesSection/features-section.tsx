"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { translationsDataFeatures } from "../../ConstData/ConstData"
import BackgroundElements from "./BackgroundElements"
import SectionHeader from "./SectionHeader"
import FeaturesList from "./FeaturesList"
import FeatureImage from "./FeatureImage"


export default function FeaturesSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { language, direction } = useLanguage()

  // Get the current language content
  const content = translationsDataFeatures[language] || translationsDataFeatures['en']

  return (
    <section id="features" className="relative w-full py-20 overflow-hidden" dir={direction}>
      {/* Background elements */}
      <BackgroundElements />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div ref={ref} className="flex flex-col">
            <SectionHeader 
              isInView={isInView} 
              sectionTitle={content.sectionTitle}
              mainTitle={content.mainTitle}
              mainDescription={content.mainDescription}
            />

            <FeaturesList 
              features={content.features} 
              isInView={isInView} 
            />
          </div>

          <FeatureImage 
            isInView={isInView} 
            featureHighlights={content.featureHighlights} 
          />
        </div>
      </div>
    </section>
  )
}