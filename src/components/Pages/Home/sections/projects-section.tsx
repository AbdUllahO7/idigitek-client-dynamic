"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function ProjectsSection({ sectionId, websiteId }) {
  const { direction } = useLanguage()
  const [currentIndex, setCurrentIndex] = useState(1) // Start at 1 (middle set)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)

  const {
    content,
    error: sectionError,
  } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "projects",
  })

  const {
    contentItems,
    error: itemsError,
  } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      image: "Background Image",
      title: "Title",
      excerpt: "Description",
      readMore: "Back Link Text",
      category: "Category",
      date: "createdAt",
      section: "section",
    },
  })

  // Filter valid projects
  const validProjects = (contentItems || []).filter((project) =>
    project.id && project.image && project.title && project.excerpt
  )

  // Create triple array for infinite loop
  const projects = validProjects.length > 0 
    ? [...validProjects, ...validProjects, ...validProjects] 
    : []

  // Auto-play functionality
  const startAutoPlay = () => {
    if (validProjects.length === 0) return
    intervalRef.current = setInterval(() => {
      nextSlide()
    }, 4000)
  }

  const stopAutoPlay = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    startAutoPlay()
    return () => stopAutoPlay()
  }, [validProjects.length])

  // Navigation functions
  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev + 1)
    
    setTimeout(() => setIsTransitioning(false), 500)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex(prev => prev - 1)
    
    setTimeout(() => setIsTransitioning(false), 500)
  }

  // Handle infinite loop reset
  useEffect(() => {
    if (validProjects.length === 0) return
    
    if (currentIndex <= 0) {
      setTimeout(() => {
        setCurrentIndex(validProjects.length * 2)
      }, 500)
    } else if (currentIndex >= validProjects.length * 2 + 1) {
      setTimeout(() => {
        setCurrentIndex(1)
      }, 500)
    }
  }, [currentIndex, validProjects.length])

  // Get current slide for dots
  const getCurrentSlide = () => {
    if (validProjects.length === 0) return 0
    return ((currentIndex - 1) % validProjects.length)
  }

  // Handle errors
  if (sectionError || itemsError) {
    return (
      <section className="py-20 bg-wtheme-background" dir={direction}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-red-500">Failed to load projects</p>
        </div>
      </section>
    )
  }

  // Handle empty state
  if (validProjects.length === 0) {
    return (
      <section className="py-20 bg-wtheme-background" dir={direction}>
        <div className="container mx-auto px-4 text-center">
          <p className="text-wtheme-text/60">No projects available</p>
        </div>
      </section>
    )
  }

  return (
    <section 
      className="py-20 bg-wtheme-background overflow-hidden" 
      dir={direction}
      onMouseEnter={stopAutoPlay}
      onMouseLeave={startAutoPlay}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-primary text-sm uppercase tracking-wider mb-4">
            {content.sectionLabel || "Portfolio"}
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold text-wtheme-text mb-6">
            {content.sectionTitle || "Our Projects"}
          </h2>
          <p className="text-lg text-wtheme-text/70 max-w-2xl mx-auto">
            {content.sectionDescription || "Explore our latest work"}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-7xl mx-auto">
          {/* Carousel Track */}
          <div className="overflow-hidden">
            <motion.div
              className="flex"
              animate={{
                x: `calc(-${currentIndex * (100/3)}% + ${currentIndex * (24/3)}px)`
              }}
              transition={{
                duration: 0.5,
                ease: "easeInOut"
              }}
            >
              {projects.map((project, index) => (
                <div
                  key={`${project.id}-${Math.floor(index / validProjects.length)}`}
                  className="w-1/3 flex-shrink-0 px-3"
                >
                  <ProjectCard 
                    project={project}
                    viewCaseStudyText={content.readMore || "View Project"}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          <div className="absolute inset-y-0 left-0 flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={prevSlide}
              disabled={isTransitioning}
              className="ml-2 rounded-full bg-white/90 backdrop-blur border shadow-lg hover:bg-white"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="absolute inset-y-0 right-0 flex items-center">
            <Button
              variant="outline"
              size="icon"
              onClick={nextSlide}
              disabled={isTransitioning}
              className="mr-2 rounded-full bg-white/90 backdrop-blur border shadow-lg hover:bg-white"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center mt-8 gap-2">
            {validProjects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (isTransitioning) return
                  stopAutoPlay()
                  setCurrentIndex(validProjects.length + index + 1)
                  setTimeout(startAutoPlay, 5000)
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  getCurrentSlide() === index
                    ? "bg-primary w-8"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>

          {/* Counter */}
          <div className="text-center mt-4">
            <span className="text-sm text-wtheme-text/60">
              {getCurrentSlide() + 1} of {validProjects.length}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}

function ProjectCard({ project, viewCaseStudyText }) {
  const { direction } = useLanguage()
  const isRTL = direction === "rtl"

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {project.category && (
          <div className="absolute top-4 left-4">
            <span className="bg-primary text-white px-3 py-1 rounded-full text-xs font-medium">
              {project.category}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {project.excerpt}
        </p>

        {project.technologies && (
          <div className="flex flex-wrap gap-1 mb-4">
            {project.technologies.slice(0, 3).map((tech, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{project.technologies.length - 3}
              </Badge>
            )}
          </div>
        )}

        <Link
          href={`/Pages/ProjectsDetailPage/${project.id}`}
          className="inline-flex items-center text-primary font-medium hover:underline text-sm"
        >
          {viewCaseStudyText}
          <ArrowRight 
            className={`w-4 h-4 ml-1 transition-transform group-hover:translate-x-1 ${
              isRTL ? "rotate-180" : ""
            }`} 
          />
        </Link>
      </CardContent>
    </div>
  )
}