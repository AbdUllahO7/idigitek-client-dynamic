"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import HeroSlide from "./HeroSlide"
import DotsNavigation from "./DotsNavigation"
import { useSectionContent } from "@/hooks/useSectionContent"

interface HeroSectionProps {
  sectionId: string
  websiteId: string
}

export default function HeroSection({ sectionId, websiteId }: HeroSectionProps) {
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Define field mappings for Hero section with dynamic {index}
  const heroFieldMappings = {
    id: (subsection: any, index?: number) => `${subsection._id}-${index || 0}`,
    image: "section {index} - Image",
    title: "section {index} - Title",
    excerpt: "section {index} - Description",
    exploreButton: "section {index} - ExploreButton",
    requestButton: "section {index} - RequestButton",
    exploreButtonType: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(
        (el) => el.name === `section ${index !== undefined ? index + 1 : 1} - ExploreButtonType`,
      )
      if (!element) return "default"
      const primaryTranslation = element.translations?.[0]
      return primaryTranslation?.content || "default"
    },
    requestButtonType: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(
        (el) => el.name === `section ${index !== undefined ? index + 1 : 1} - RequestButtonType`,
      )
      if (!element) return "default"
      const primaryTranslation = element.translations?.[0]
      return primaryTranslation?.content || "default"
    },
    exploreButtonUrl: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(
        (el) => el.name === `section ${index !== undefined ? index + 1 : 1} - ExploreButtonUrl`,
      )
      if (!element) return ""
      const primaryTranslation = element.translations?.[0]
      return primaryTranslation?.content || ""
    },
    requestButtonUrl: (subsection: any, index?: number) => {
      const element = subsection.elements?.find(
        (el) => el.name === `section ${index !== undefined ? index + 1 : 1} - RequestButtonUrl`,
      )
      if (!element) return ""
      const primaryTranslation = element.translations?.[0]
      return primaryTranslation?.content || ""
    },
    color: (subsection: any, index?: number) =>
      subsection.elements?.find((el) => el.name === `Hero ${index !== undefined ? index + 1 : 1} - Color`)
        ?.defaultContent || "from-primary to-accent",
    order: (subsection: any, index?: number) => subsection.order || index || 0,
  }

  // Filter valid slides
  const slideFilter = (item: { image: string; title: string }) => item.image && item.title && item.title.trim() !== ""

  const { contentItems: slides } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: heroFieldMappings,
    maxItemsPerSubsection: 10,
    filter: slideFilter,
  })

  // Preload critical images
  useEffect(() => {
    if (slides.length > 0) {
      const preloadImages = async () => {
        // Preload first slide image (LCP candidate)
        if (slides[0]?.image) {
          const link = document.createElement("link")
          link.rel = "preload"
          link.as = "image"
          link.href = slides[0].image
          link.fetchPriority = "high"
          document.head.appendChild(link)
        }

        // Preload next few images in background
        const imagesToPreload = slides.slice(0, 3) // First 3 slides
        const promises = imagesToPreload.map((slide) => {
          return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = resolve
            img.onerror = reject
            img.src = slide.image
          })
        })

        try {
          await Promise.allSettled(promises)
          setImagesLoaded(true)
        } catch (error) {
          console.warn("Some images failed to preload:", error)
          setImagesLoaded(true) // Continue anyway
        }
      }

      preloadImages()
    }
  }, [slides])

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault()
      scrollToSection(sectionId)
    },
    [scrollToSection],
  )

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))
  }, [slides.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  }, [slides.length])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  const handleMouseEnter = useCallback(() => setAutoplay(false), [])
  const handleMouseLeave = useCallback(() => setAutoplay(true), [])

  // Optimized autoplay with better cleanup
  useEffect(() => {
    if (autoplay && slides.length > 1 && imagesLoaded) {
      autoplayRef.current = setTimeout(nextSlide, 5000)
    }
    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current)
        autoplayRef.current = null
      }
    }
  }, [currentSlide, autoplay, slides.length, nextSlide, imagesLoaded])

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative w-full  bg-wtheme-background overflow-hidden min-h-screen h-[100dvh] sm:h-screen"
      id="hero"
      dir={direction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Mobile-optimized layout */}
      <div className="h-full w-full relative">
        {/* Slide Content - Full screen on mobile */}
        <div className="absolute inset-0 z-10 container">
          <AnimatePresence mode="wait" initial={false}>
            {slides.map(
              (slide, index) =>
                currentSlide === index && (
                  <HeroSlide
                    key={slide.id}
                    slide={slide}
                    index={index}
                    direction={direction}
                    language={language}
                    handleNavClick={handleNavClick}
                  />
                ),
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Controls Overlay */}
        {slides.length > 1 && (
          <div className="absolute inset-0 z-20 pointer-events-none">
            {/* Mobile Navigation - Touch-friendly arrows */}
            <div className="md:hidden h-full flex items-center justify-between px-2 sm:px-4">
              <button
                onClick={prevSlide}
                className="pointer-events-auto flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-black/70 active:bg-black/80 transition-all duration-200 shadow-lg active:scale-90 touch-manipulation"
                aria-label="Previous slide"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="pointer-events-auto flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black/50 backdrop-blur-sm border border-white/30 rounded-full text-white hover:bg-black/70 active:bg-black/80 transition-all duration-200 shadow-lg active:scale-90 touch-manipulation"
                aria-label="Next slide"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Desktop Navigation - Outside content area */}
            <div className="hidden md:block">
              {/* Left Arrow */}
              <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2">
                <button
                  onClick={prevSlide}
                  className="pointer-events-auto flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Previous slide"
                >
                  <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              </div>

              {/* Right Arrow */}
              <div className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2">
                <button
                  onClick={nextSlide}
                  className="pointer-events-auto flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white hover:bg-white/20 transition-all duration-300 shadow-lg hover:shadow-xl"
                  aria-label="Next slide"
                >
                  <svg className="w-6 h-6 lg:w-7 lg:h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dots Navigation - Bottom center */}
            <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 -translate-x-1/2">
              <div className="pointer-events-auto">
                <DotsNavigation slidesCount={slides.length} currentSlide={currentSlide} goToSlide={goToSlide} />
              </div>
            </div>
          </div>
        )}

        {/* Progress Bar (optional) */}
        {slides.length > 1 && (
          <div className="absolute top-0 left-0 right-0 z-30">
            <div className="h-0.5 sm:h-1 bg-black/20">
              <div
                className="h-full bg-white/70 transition-all duration-300 ease-out"
                style={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Mobile Slide Counter */}
        <div className="md:hidden absolute top-3 sm:top-4 right-3 sm:right-4 z-30 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1 sm:px-3 sm:py-1">
          <span className="text-white text-xs sm:text-sm font-medium">
            {currentSlide + 1} / {slides.length}
          </span>
        </div>
      </div>
    </motion.section>
  )
}
