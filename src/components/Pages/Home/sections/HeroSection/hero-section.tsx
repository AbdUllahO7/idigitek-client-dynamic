"use client"

import { useState, useEffect, useRef } from "react"
import { AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { slidesHero } from "../../ConstData/ConstData"
import HeroSlide from "./HeroSlide"
import HeroNavigation from "./HeroNavigation"
import DotsNavigation from "./DotsNavigation"
import CurvedDivider from "./CurvedDivider"


export default function HeroSection() {
  const { direction, language } = useLanguage()
  const scrollToSection = useScrollToSection()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [autoplay, setAutoplay] = useState(true)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    scrollToSection(sectionId)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slidesHero.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slidesHero.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Pause autoplay on hover
  const handleMouseEnter = () => setAutoplay(false)
  const handleMouseLeave = () => setAutoplay(true)

  // Autoplay functionality
  useEffect(() => {
    if (autoplay) {
      autoplayRef.current = setTimeout(() => {
        nextSlide()
      }, 5000)
    }

    return () => {
      if (autoplayRef.current) {
        clearTimeout(autoplayRef.current)
      }
    }
  }, [currentSlide, autoplay])

  // Determine title and description based on current language
  const getCurrentSlideText = (slide: typeof slidesHero[0]) => {
    return {
      title: language === 'ar' ? slide.titleAr : slide.titleEn,
      description: language === 'ar' ? slide.descriptionAr : slide.descriptionEn
    }
  }

  return (
    <section
      className="relative w-full overflow-hidden bg-gradient-to-b from-background to-muted"
      id="hero"
      dir={direction}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container relative z-10 px-4 py-16 md:py-24 lg:py-10 h-[100vh]">
        <div className="relative h-[500px] md:h-[600px] lg:h-[650px] w-full">
          <AnimatePresence mode="wait">
            {slidesHero.map(
              (slide, index) =>
                currentSlide === index && (
                  <HeroSlide 
                    key={index}
                    slide={slide}
                    index={index}
                    direction={direction}
                    language={language}
                    getCurrentSlideText={getCurrentSlideText}
                    handleNavClick={handleNavClick}
                  />
                ),
            )}
          </AnimatePresence>

          <HeroNavigation 
            direction={direction} 
            nextSlide={nextSlide} 
            prevSlide={prevSlide} 
          />

          <DotsNavigation 
            slidesCount={slidesHero.length} 
            currentSlide={currentSlide} 
            goToSlide={goToSlide} 
          />
        </div>
      </div>

      <CurvedDivider />
    </section>
  )
}