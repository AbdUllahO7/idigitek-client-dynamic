"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import SectionBackground from "./SectionBackground"
import SectionHeader from "./SectionHeader"
import IndustriesGrid from "./IndustriesGrid"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

interface Industry {
  id: string
  title: string
  excerpt: string
  image: string
  color: string
  order: number
}

export default function IndustrySolutionsSection({ sectionId, websiteId }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { language, direction } = useLanguage()


  const { content, isLoading: sectionLoading, error: sectionError, refetch, formatDate } = useSectionLogic({
      sectionId,
      websiteId,
      itemsKey: "industries",
    })

  // For SINGLE items (each subsection has one industry)
  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent<Industry>({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      image: "Background Image",    // or "Industry - Image" 
      title: "Title",               // or "Industry - Title"
      excerpt: "Description",       // or "Industry - Description"
      color: () => "from-digitek-orange to-digitek-pink",
      order: (subsection: any) => subsection.order || 0
    },
  })


  return (
    <section id="industry" className="relative w-full py-12 overflow-hidden" dir={direction}>
      {/* Background elements */}
      <SectionBackground />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <SectionHeader
            isInView={isInView}
            sectionTitle={content.sectionLabel}
            mainTitle={content.sectionTitle}
            mainDescription={content.sectionDescription}
          />
        </div>

        <IndustriesGrid 
          industries={contentItems} 
          isInView={isInView} 
        />
      </div>
    </section>
  )
}