"use client"

import { useEffect, useRef, useState } from "react"

export function useScrollAnimation({
  threshold = 0.1,
  rootMargin = "0px",
} = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin }
    )

    if (ref.current) observer.observe(ref.current)

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, isInView }
}
