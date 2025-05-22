"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface HeroNavigationProps {
  direction: string
  nextSlide: () => void
  prevSlide: () => void
}

export default function HeroNavigation({ direction, nextSlide, prevSlide }: HeroNavigationProps) {
  const { t } = useLanguage()

  return (
    <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
        onClick={direction === 'ltr' ? prevSlide : nextSlide}
      >
        {direction === 'ltr' ? (
          <ChevronLeft className="h-5 w-5" />
        ) : (
          <ChevronRight className="h-5 w-5 transform scale-x-[-1]" />
        )}
        <span className="sr-only">{t("hero.previousSlide")}</span>
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
        onClick={direction === 'ltr' ? nextSlide : prevSlide}
      >
        {direction === 'ltr' ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <ChevronLeft className="h-5 w-5 transform scale-x-[-1]" />
        )}
        <span className="sr-only">{t("hero.nextSlide")}</span>
      </Button>
    </div>
  )
}