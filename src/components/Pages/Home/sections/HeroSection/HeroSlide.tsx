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
    exploreButtonType: string
    requestButtonType: string
    exploreButtonUrl: string
    requestButtonUrl: string
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
  
  // Helper function to determine if URL is external
  const isExternalUrl = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'))
  }
  
  // Helper function to get button variant based on type
  const getButtonVariant = (buttonType: string) => {
    switch (buttonType) {
      case 'special':
        return 'default' // Primary style for special buttons
      case 'outline':
        return 'outline'
      case 'ghost':
        return 'ghost'
      case 'secondary':
        return 'secondary'
      default:
        return 'outline' // Default fallback
    }
  }
  
  // Helper function to get button class based on type
  const getButtonClass = (buttonType: string) => {
    const baseClass = "shadow-sm transition-all duration-200"
    
    switch (buttonType) {
      case 'special':
        return `${baseClass} bg-primary text-primary-foreground hover:bg-primary/90`
      case 'outline':
        return `${baseClass} border-2 border-primary hover:bg-wtheme-hover hover:text-primary-foreground`
      default:
        return `${baseClass} border-2 border-primary hover:bg-wtheme-hover hover:text-primary-foreground`
    }
  }

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
          {/* Explore Button */}
          {slide.exploreButton && (
            <Button
              asChild
              size="lg"
              variant={getButtonVariant(slide.exploreButtonType)}
              className={getButtonClass(slide.exploreButtonType)}
            >
              {isExternalUrl(slide.exploreButtonUrl) ? (
                <a 
                  href={slide.exploreButtonUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {slide.exploreButton}
                  {direction === "ltr" && <ArrowRight className="ml-2 h-4 w-4" />}
                  {direction === "rtl" && <ArrowRight className="mr-2 h-4 w-4 transform scale-x-[-1]" />}
                </a>
              ) : (
                <Link 
                  href={slide.exploreButtonUrl || "#"} 
                  onClick={slide.exploreButtonUrl && !isExternalUrl(slide.exploreButtonUrl) 
                    ? (e) => handleNavClick(e, slide.exploreButtonUrl.replace('#', '')) 
                    : undefined
                  }
                >
                  {slide.exploreButton}
                  {direction === "ltr" && <ArrowRight className="ml-2 h-4 w-4" />}
                  {direction === "rtl" && <ArrowRight className="mr-2 h-4 w-4 transform scale-x-[-1]" />}
                </Link>
              )}
            </Button>
          )}

          {/* Request Button */}
          {slide.requestButton && (
            <Button 
              asChild 
              variant={getButtonVariant(slide.requestButtonType)}
              size="lg" 
              className={getButtonClass(slide.requestButtonType)}
            >
              {isExternalUrl(slide.requestButtonUrl) ? (
                <a 
                  href={slide.requestButtonUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  {slide.requestButton}
                </a>
              ) : (
                <Link 
                  href={slide.requestButtonUrl || "#"} 
                  onClick={slide.requestButtonUrl && !isExternalUrl(slide.requestButtonUrl) 
                    ? (e) => handleNavClick(e, slide.requestButtonUrl.replace('#', '')) 
                    : undefined
                  }
                >
                  {slide.requestButton}
                </Link>
              )}
            </Button>
          )}
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