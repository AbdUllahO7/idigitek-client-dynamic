"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { translationsDataFeatures } from "../../ConstData/ConstData"
import BackgroundElements from "./BackgroundElements"
import SectionHeader from "./SectionHeader"
import FeaturesList from "./FeaturesList"
import FeatureImage from "./FeatureImage"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

interface Features {
  id: string
  title: string
  excerpt: string
  icon: string
  color: string
  order: number
  image: string
}

export default function FeaturesSection({ sectionId, websiteId }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { language, direction } = useLanguage()

    const { content, isLoading: sectionLoading, error: sectionError, refetch, formatDate } = useSectionLogic({
        sectionId,
        websiteId,
        itemsKey: "Features",
      })
  const featureFilter = (item: Features) => item.title && item.title.trim() !== ""

  console.log("FeaturesSection content:", content)


    const heroFieldMappings = {
      id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`, 
      icon: "ChoseUs {index} - Icon",
      title: "ChoseUs {index} - Title",
      excerpt: "ChoseUs {index} - Description",
      image: "Background Image",

      color: (subsection: any, index?: number) =>
        subsection.elements?.find(el => el.name === `Hero ${index !== undefined ? index + 1 : 1} - Color`)?.defaultContent ||
        "from-digitek-orange to-digitek-pink",
      order: (subsection: any, index?: number) => subsection.order || index || 0
  }

  
  // For SINGLE items (each subsection has one industry)
  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: heroFieldMappings,
    maxItemsPerSubsection: 13, // Adjust as needed
    filter: featureFilter
  })

  console.log("FeaturesSection contentItems:", contentItems)


  return (
    <section id="features" className="relative w-full py-20 overflow-hidden" dir={direction}>
      {/* Background elements */}
      <BackgroundElements />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          <div ref={ref} className="flex flex-col">
            <SectionHeader 
              isInView={isInView} 
              sectionTitle={content.sectionLabel}
              mainTitle={content.sectionTitle}
              mainDescription={content.sectionDescription}
            />

            <FeaturesList 
              features={contentItems} 
              isInView={isInView} 
            />
          </div>

           <FeatureImage 
            isInView={isInView} 
            image={contentItems[0]?.image} 
          /> 
        </div>
      </div>
    </section>
  )
}