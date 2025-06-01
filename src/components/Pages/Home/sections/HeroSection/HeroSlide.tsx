"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import SlideContent from "./SlideContent"
import SlideImage from "./SlideImage"

interface HeroSlideProps {
  slide: {
    id: string
    image: string
    title: string
    excerpt: string
    exploreButton: string
    requestButton: string
    color: string
  }
  index: number
  direction: string
  language: string
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void
}

export default function HeroSlide({
  slide,
  index,
  direction,
  language,
  handleNavClick
}: HeroSlideProps) {
  return (
    <motion.div
      key={index}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute inset-0 grid lg:grid-cols-2 gap-8 items-center"
    >
      {/* Content */}
      <SlideContent
        title={slide.title}
        description={slide.excerpt}
        color={slide.color}
        direction={direction}
        
      >
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          {/* Primary Button - UPDATED to use website theme */}
          <Button
            asChild
            size="lg"
            variant="outline" 
            className="border-2 border-primary text-wtheme-text hover:bg-wtheme-hover  hover:text-primary-foreground shadow-sm transition-all duration-200"
          >
            <Link href="#demo" onClick={(e) => handleNavClick(e, "demo")}>
              {language === "en" ? slide.requestButton || "Request Demo" : slide.requestButton || "طلب عرض توضيحي"}
              {direction === "ltr" && <ArrowRight className="ml-2 h-4 w-4" />}
              {direction === "rtl" && <ArrowRight className="mr-2 h-4 w-4 transform scale-x-[-1]" />}
            </Link>
          </Button>

          {/* Secondary Button - UPDATED to use website theme */}
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="border-2 border-primary text-wtheme-text hover:bg-wtheme-hover hover:text-primary-foreground shadow-sm transition-all duration-200"
          >
            <Link href="#services" onClick={(e) => handleNavClick(e, "services")}>
              {language === "en" ? slide.exploreButton || "Explore Solutions" : slide.exploreButton || "استكشاف الحلول"}
            </Link>
          </Button>
          
        </div>
      </SlideContent>

      {/* Image */}
      <SlideImage
        image={slide.image || "/placeholder.svg"}
        title={slide.title}
        color={slide.color}
      />
    </motion.div>
  )
}