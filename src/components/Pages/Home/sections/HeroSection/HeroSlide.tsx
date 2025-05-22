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
    titleEn: string
    titleAr: string
    descriptionEn: string
    descriptionAr: string
    color: string
    image: string
  }
  index: number
  direction: string
  language: string
  getCurrentSlideText: (slide: any) => { title: string; description: string }
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void
}

export default function HeroSlide({
  slide,
  index,
  direction,
  language,
  getCurrentSlideText,
  handleNavClick
}: HeroSlideProps) {
  const { title, description } = getCurrentSlideText(slide)

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
        title={title}
        description={description}
        color={slide.color}
        direction={direction}
      >
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            asChild
            size="lg"
            className={`bg-gradient-to-r ${slide.color} hover:opacity-90 text-white shadow-lg`}
          >
            <Link href="#demo" onClick={(e) => handleNavClick(e, "demo")}>
              {language === 'en' ? "Request Demo" : "طلب عرض توضيحي"}
              {direction === 'ltr' && <ArrowRight className="ml-2 h-4 w-4" />}
              {direction === 'rtl' && <ArrowRight className="mr-2 h-4 w-4 transform scale-x-[-1]" />}
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="border-2 shadow-sm">
            <Link href="#services" onClick={(e) => handleNavClick(e, "services")}>
              {language === 'en' ? "Explore Solutions" : "استكشاف الحلول"}
            </Link>
          </Button>
        </div>
      </SlideContent>

      {/* Image */}
      <SlideImage 
        image={slide.image || "/placeholder.svg"} 
        title={title} 
        color={slide.color} 
      />
    </motion.div>
  )
}