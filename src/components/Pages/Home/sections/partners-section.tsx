"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"
import { useState, useRef, useEffect } from "react"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function PartnersSection({ websiteId, sectionId }) {
  const { ref, isInView } = useScrollAnimation()
  const { t, direction, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  
  const {
    content,
    isLoading: sectionLoading,
    error: sectionError,
    refetch,
    formatDate,
  } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "partners",
  })

  const featureFilter = (item: { image: string }) => item.image && item.image.trim() !== ""

  const ContentItemsMappings = {
        id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`,
        date : "createdAt",
        image: "Image {index}",
        excerpt: "ClientComments {index} - Description",
        color: () => "theme-gradient",
        order: (subsection: any, index?: number) => subsection.order || index || 0,
  }

  const {
    contentItems,
    isLoading: itemsLoading,
    error: itemsError,
  } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: ContentItemsMappings,
    maxItemsPerSubsection: 13,
    filter: featureFilter,
  })

  const isRTL = direction === "rtl"

  return (
    <section id="partners" className="w-full py-20 bg-wtheme-background" dir={direction}>
      <div className="container px-4 md:px-6" ref={containerRef}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            },
          }}
          className="flex flex-col items-center justify-center space-y-4 text-center"
        >
          <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
            >
              {content.sectionLabel}
            </motion.span>
          <div className="space-y-2">
            <h2 className="text-3xl font-heading font-bold tracking-tighter text-wtheme-text sm:text-5xl">
              {content.sectionTitle}
            </h2>
            <p className="max-w-[900px] text-wtheme-text font-body ">
              {content.sectionDescription}
            </p>
          </div>
        </motion.div>

        {/* Partners Carousel */}
        <div className="mt-12">
          <PartnersCarousel
            partners={contentItems} // Pass contentItems instead of partners
            isInView={isInView}
            isRTL={isRTL}
            containerRef={containerRef}
          />
        </div>
      </div>
    </section>
  )
}

interface PartnersCarouselProps {
  partners: {
    logo?: string
    jobAr?: string
    job?: string
    excerpt?: string
    excerptAr?: any
    color?: string
    image: string
    accent?: string
    titleAr?: string
    title?: string
    id?: any
    order?: number
    isMain?: boolean
  }[]
  isInView: boolean
  isRTL: boolean
  containerRef: React.RefObject<HTMLDivElement>
}

function PartnersCarousel({ partners, isInView, isRTL, containerRef }: PartnersCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { direction } = useLanguage()
  const carouselRef = useRef<HTMLDivElement>(null)
  
  // Initial state with SSR-safe default value
  const [partnersPerView, setPartnersPerView] = useState(6)
  const maxSlides = Math.max(0, partners.length - partnersPerView)
  
  // Handle responsive partners per view
  useEffect(() => {
    const getPartnersPerView = () => {
      if (typeof window === "undefined") return 6 // SSR default
      if (window.innerWidth < 640) return 2
      if (window.innerWidth < 768) return 3
      if (window.innerWidth < 1024) return 4
      return 6
    }
    
    const handleResize = () => {
      setPartnersPerView(getPartnersPerView())
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handlePrev = () => {
    setCurrentSlide((prev) => (isRTL ? Math.min(prev + 1, maxSlides) : Math.max(prev - 1, 0)))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (isRTL ? Math.max(prev - 1, 0) : Math.min(prev + 1, maxSlides)))
  }

  // Mouse parallax effect for navigation buttons
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  const slideWidth = 100 / partnersPerView

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      <div className="relative">
        <div className="overflow-hidden" ref={carouselRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${isRTL ? currentSlide * slideWidth : -currentSlide * slideWidth}%)`,
            }}
          >
            {partners.map((partner, index) => (
              <div
                key={index}
                className="px-2 md:px-4"
                style={{
                  minWidth: `${slideWidth}%`,
                  flex: `0 0 ${slideWidth}%`,
                }}
              >
                <PartnerLogo partner={partner} index={index} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        {partners.length > partnersPerView && (
          <div className="flex justify-center mt-8 md:mt-12 gap-4 md:gap-6">
            <motion.div
              style={{
                x: mousePosition.x * -10,
                y: mousePosition.y * -10,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary/20 bg-wtheme-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 w-10 h-10 md:w-12 md:h-12 shadow-md hover:shadow-lg"
                onClick={handlePrev}
                disabled={isRTL ? currentSlide >= maxSlides : currentSlide <= 0}
              >
                <ChevronLeft className={`h-4 w-4 md:h-5 md:w-5 ${isRTL ? "rotate-180" : ""}`} />
                <span className="sr-only">Previous</span>
              </Button>
            </motion.div>

            <motion.div
              style={{
                x: mousePosition.x * 10,
                y: mousePosition.y * -10,
              }}
              transition={{ type: "spring", stiffness: 150, damping: 15 }}
            >
              <Button
                variant="outline"
                size="icon"
                className="rounded-full border-primary/20 bg-wtheme-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 w-10 h-10 md:w-12 md:h-12 shadow-md hover:shadow-lg"
                onClick={handleNext}
                disabled={isRTL ? currentSlide <= 0 : currentSlide >= maxSlides}
              >
                <ChevronRight className={`h-4 w-4 md:h-5 md:w-5 ${isRTL ? "rotate-180" : ""}`} />
                <span className="sr-only">Next</span>
              </Button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

interface PartnerLogoProps {
  partner: {
    image: string // Updated to match ContentItemsMappings
  }
  index: number
}

function PartnerLogo({ partner, index }: PartnerLogoProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
        borderColor: "var(--website-theme-primary)",
      }}
      className="flex items-center justify-center rounded-lg border border-wtheme-border/50 bg-wtheme-background p-4 shadow-sm h-full"
    >
      <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
        <Image
          src={partner.image || "/placeholder.svg"} // Use image from contentItems
          alt={partner.image || `Partner ${index + 1}`}
          width={120}
          height={80}
          className="h-12 w-auto object-contain grayscale transition-all hover:grayscale-0"
        />
      </motion.div>
    </motion.div>
  )
}