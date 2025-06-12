"use client"

import { useLanguage } from "@/contexts/language-context"

interface DotsNavigationProps {
  slidesCount: number
  currentSlide: number
  goToSlide: (index: number) => void
}

export default function DotsNavigation({ 
  slidesCount, 
  currentSlide, 
  goToSlide 
}: DotsNavigationProps) {
  const { t } = useLanguage()

  return (
    <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4 z-20">
      {Array.from({ length: slidesCount }).map((_, index) => (
        <button
          key={index}
          onClick={() => goToSlide(index)}
          className={`w-3 h-3 rounded-full transition-all ${
            currentSlide === index ? "bg-primary w-8" : "bg-primary hover:bg-primary"
          }`}
          aria-label={`${t("hero.goToSlide")} ${index + 1}`}
        />
      ))}
    </div>
  )
}