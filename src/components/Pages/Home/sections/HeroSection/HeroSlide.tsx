"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import SlideContent from "./SlideContent"
import SlideImage from "./SlideImage"

interface HeroSlideProps {
  slide: {
    id?: string
    image?: string
    title?: string
    excerpt?: string
    exploreButton?: string
    requestButton?: string
    exploreButtonType?: string
    requestButtonType?: string
    exploreButtonUrl?: string
    requestButtonUrl?: string
    color?: string
  }
  index: number
  direction?: 'ltr' | 'rtl'
  language: string
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void
}

export default function HeroSlide({
  slide,
  index,
  direction,
  handleNavClick
}: HeroSlideProps) {
  
  const isExternalUrl = (url: string) => {
    return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'))
  }

  return (
    <div
      key={index}
      className="absolute inset-0 mt-20 flex flex-col lg:grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 items-center px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-0"
    >
      {/* Content Section */}
      <div className="w-full flex-shrink-0 lg:flex-shrink">
        <SlideContent
          title={slide.title}
          description={slide.excerpt}
          color={slide.color}
          direction={direction}
        >
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-3 sm:pt-4 w-full">
            {slide.exploreButton && (
              <Button
                asChild
                size="lg"
                variant="default"
                className="w-full sm:w-auto border-2 border-primary dark:bg-primary text-wtheme-text min-h-[44px] text-sm sm:text-base"
              >
                {isExternalUrl(slide.exploreButtonUrl) ? (
                  <a 
                    href={slide.exploreButtonUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    {slide.exploreButton}
                    {direction === "ltr" && <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />}
                    {direction === "rtl" && <ArrowRight className="mr-2 h-4 w-4 flex-shrink-0 transform scale-x-[-1]" />}
                  </a>
                ) : (
                  <Link 
                    href={slide.exploreButtonUrl || "#"} 
                    onClick={slide.exploreButtonUrl && !isExternalUrl(slide.exploreButtonUrl) 
                      ? (e) => handleNavClick(e, slide.exploreButtonUrl.replace('#', '')) 
                      : undefined
                    }
                    className="flex items-center justify-center"
                  >
                    {slide.exploreButton}
                    {direction === "ltr" && <ArrowRight className="ml-2 h-4 w-4 flex-shrink-0" />}
                    {direction === "rtl" && <ArrowRight className="mr-2 h-4 w-4 flex-shrink-0 transform scale-x-[-1]" />}
                  </Link>
                )}
              </Button>
            )}
          </div>
        </SlideContent>
      </div>

      {/* Image Section */}
      <div className="w-full flex-1 lg:flex-shrink-0 min-h-[200px] sm:min-h-[250px] lg:min-h-0">
        <SlideImage
          image={slide.image || "/placeholder.svg"}
          title={slide.title}
          color={slide.color}
        />
      </div>
    </div>
  )
}