"use client"

import type React from "react"
import Image from "next/image"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useState, useRef, useEffect } from "react"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"
import { motion, useAnimation, useAnimationControls } from 'framer-motion';
import { FadeIn } from "@/utils/OptimizedAnimations"

// ----------------------------------------------------------------------
// Main Component
// ----------------------------------------------------------------------

export default function PartnersSection({ websiteId, sectionId }: { websiteId: string, sectionId: string }) {
  const { ref, isInView } = useScrollAnimation()
  const containerRef = useRef<HTMLDivElement>(null)

  const { content } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "partners",
  })

  // Filter to ensure images exist
  const featureFilter = (item: { image: string }) => item.image && item.image.trim() !== ""

  const ContentItemsMappings = {
    id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`,
    date: "createdAt",
    image: "Image {index}",
    excerpt: "ClientComments {index} - Description",
    color: () => "theme-gradient",
    order: (subsection: any, index?: number) => subsection.order || index || 0,
  }

  const { contentItems } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: ContentItemsMappings,
    maxItemsPerSubsection: 50,
    filter: featureFilter,
  })

  return (
    <section 
      id="partners" 
      className="relative w-full py-20 overflow-hidden bg-wtheme-background"
      dir="ltr"
      style={{ direction: 'ltr' }}
    >
      {/* 1. Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-wtheme-background via-wtheme-background to-primary/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(var(--primary),0.1)_0%,transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(var(--primary),0.05)_0%,transparent_50%)]"></div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <FadeIn
            key={i}
            className="absolute w-2 h-2 bg-primary/20 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${10 + (i % 3) * 30}%`,
            }}
          />
        ))}
      </div>

      <div className="relative container px-4 md:px-6" ref={containerRef}>
        
        {/* 2. Header Section */}
        <FadeIn
          ref={ref}
          className="flex flex-col items-center justify-center space-y-6 text-center mb-16"
        >
          {/* Label */}
          <FadeIn className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl"></div>
            <span className="inline-block mb-2 text-body text-primary tracking-wider uppercase font-medium">
              {content.sectionLabel || "Our Partners"}
            </span>
          </FadeIn>

          {/* Title */}
          <div className="space-y-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-wtheme-text relative">
              <span className="relative inline-block">
                {content.sectionTitle || "Trusted By Industry Leaders"}
                <motion.div 
                  className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-primary to-primary/60 rounded-full" 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </span>
            </h2>
            <p className="max-w-3xl text-lg text-wtheme-text/70 leading-relaxed mx-auto">
              {content.sectionDescription}
            </p>
          </div>
        </FadeIn>

        {/* 3. The Carousel (Fixed) */}
        <div className="relative w-full">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent blur-3xl pointer-events-none"></div>
          
          {contentItems.length > 0 && (
            <PartnersCarousel
              partners={contentItems}
              isInView={isInView}
              containerRef={containerRef}
            />
          )}
        </div>

        {/* 4. Trust Dots */}
        <FadeIn className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-wtheme-text/60">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 h-1 bg-primary/60 rounded-full"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ----------------------------------------------------------------------
// Carousel Logic
// ----------------------------------------------------------------------

interface PartnersCarouselProps {
  partners: any[]
  isInView: boolean
  containerRef: React.RefObject<HTMLDivElement>
}

function PartnersCarousel({ partners, isInView }: PartnersCarouselProps) {
  const [screenSize, setScreenSize] = useState("desktop")
  const controls = useAnimationControls()

  const hasPartners = partners && partners.length > 0

  // ✅ Hook always runs
  useEffect(() => {
    if (!hasPartners) return

    const handleResize = () => {
      if (typeof window === "undefined") return
      if (window.innerWidth < 640) setScreenSize("mobile")
      else if (window.innerWidth < 768) setScreenSize("sm")
      else if (window.innerWidth < 1024) setScreenSize("md")
      else if (window.innerWidth < 1280) setScreenSize("lg")
      else setScreenSize("xl")
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [hasPartners])

  // ✅ Hook always runs
  useEffect(() => {
    if (!hasPartners || !isInView) return

    controls.start({
      x: "-25%",
      transition: {
        duration: Math.max(partners.length * 2, 30),
        ease: "linear",
        repeat: Infinity,
      },
    })
  }, [hasPartners, isInView, controls, partners.length])

  // ✅ Render guard AFTER hooks
  if (!hasPartners) {
    return null
  }

  const duplicatedPartners = [...partners, ...partners, ...partners, ...partners]

  return (
    <div className="relative w-full overflow-hidden" dir="ltr">
      <motion.div
        className="flex w-max"
        initial={{ x: 0 }}
        animate={controls}
      >
        {duplicatedPartners.map((partner, index) => (
          <div key={index} className="flex-shrink-0 px-4 w-40">
            <PartnerLogo
              partner={partner}
              index={index}
              heightClass="h-20"
              screenSize={screenSize}
            />
          </div>
        ))}
      </motion.div>
    </div>
  )
}


// ----------------------------------------------------------------------
// Logo Item
// ----------------------------------------------------------------------

interface PartnerLogoProps {
  partner: { image: string }
  index: number
  heightClass: string
  screenSize: string
}

function PartnerLogo({ partner, index, heightClass, screenSize }: PartnerLogoProps) {
  const getImageSize = () => {
    switch (screenSize) {
      case "mobile": return { width: 100, height: 50, maxHeight: "max-h-8" }
      case "sm": return { width: 120, height: 60, maxHeight: "max-h-10" }
      case "md": return { width: 140, height: 70, maxHeight: "max-h-12" }
      case "lg": return { width: 160, height: 80, maxHeight: "max-h-14" }
      default: return { width: 180, height: 90, maxHeight: "max-h-16" }
    }
  }

  const imageConfig = getImageSize()

  return (
    <div
      className={`
        partner-logo flex items-center justify-center 
        rounded-2xl border border-white/10 
        bg-gradient-to-br from-white/5 to-white/[0.02]
        backdrop-blur-sm
        p-4 sm:p-5 md:p-6 lg:p-7
        shadow-lg hover:shadow-primary/20
        ${heightClass} w-full 
        transition-all duration-300 ease-out
        group cursor-pointer
        relative overflow-hidden
      `}
    >
      {/* Background Hover Flash */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Image */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        <Image
          src={partner.image || "/placeholder.svg"}
          alt={`Partner logo ${index}`}
          width={imageConfig.width}
          height={imageConfig.height}
          className={`
            w-auto h-auto 
            ${imageConfig.maxHeight} 
            max-w-full 
            object-contain 
            filter
            transition-transform duration-500
            group-hover:scale-110
          `}
          loading="lazy"
        />
      </div>
    </div>
  )
}