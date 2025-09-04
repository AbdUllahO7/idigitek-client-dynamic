"use client"

import { memo, useState } from "react"
import Image from "next/image"

interface SlideImageProps {
  image: string
  title?: string
  color?: string
  isActive?: boolean
  priority?: boolean
}

const SlideImage = memo(function SlideImage({ 
  image, 
  title = "", 
  color = "from-blue-500 to-purple-600", 
  priority = false 
}: SlideImageProps) {
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  // Fallback image if original fails
  const fallbackImage = "/placeholder.svg"
  
  // Use the provided image or fallback
  const displayImage = imageError ? fallbackImage : image

  const handleImageError = () => {
    console.warn('Failed to load image:', image)
    setImageError(true)
    setImageLoading(false)
  }

  const handleImageLoad = () => {
    setImageLoading(false)
    if (priority) {
      // Mark LCP as ready
      if (typeof performance !== 'undefined') {
        performance.mark('lcp-ready')
      }
    }
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">
      {/* Background effect - responsive sizing */}
      <div
        className={`absolute inset-2 sm:inset-4 lg:inset-0 bg-gradient-to-r ${color} opacity-10 rounded-xl sm:rounded-2xl blur-md sm:blur-xl transform rotate-1 sm:rotate-3 scale-105 slide-image-bg-effect`}
      />

      {/* Main image container with responsive gradient border */}
      <div className={`relative bg-gradient-to-r p-0.5 sm:p-1 ${color} rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl`}>
        <div className="bg-background rounded-lg sm:rounded-xl overflow-hidden">
          <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[16/10]">
            {/* Loading placeholder - responsive sizing */}
            {imageLoading && (
              <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg sm:rounded-xl flex items-center justify-center">
                <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            
            <Image
              src={displayImage}
              fill
              alt={title || "Slide image"}
              className={`object-cover rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 50vw, 40vw"
              priority={priority}
              quality={85}
            />
          </div>
        </div>
      </div>
    </div>
  )
})

export default SlideImage