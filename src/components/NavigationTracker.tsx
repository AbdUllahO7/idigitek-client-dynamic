'use client'

import { usePathname } from "next/navigation"
import { useEffect } from "react"

/**
 * This component tracks navigation between pages and sections
 * It should be included in your layout file so it's present on all pages
 */
export function NavigationTracker() {
  const pathname = usePathname()
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // When the pathname changes, store the current path and hash
      const currentPath = pathname
      const currentHash = window.location.hash
      const fullPath = currentPath + currentHash
      
      // Store last path before the current one
      const lastPath = sessionStorage.getItem("currentPath")
      if (lastPath) {
        sessionStorage.setItem("lastPath", lastPath)
        const lastScrollPosition = sessionStorage.getItem("currentScrollPosition")
        if (lastScrollPosition) {
          sessionStorage.setItem("lastScrollPosition", lastScrollPosition)
        }
      }
      
      // Update current path
      sessionStorage.setItem("currentPath", fullPath)
      
      // Track scroll position
      const trackScroll = () => {
        sessionStorage.setItem("currentScrollPosition", String(window.scrollY))
      }
      
      window.addEventListener('scroll', trackScroll)
      
      return () => {
        window.removeEventListener('scroll', trackScroll)
      }
    }
  }, [pathname])

  // This is a utility component that doesn't render anything
  return null
}

export default NavigationTracker