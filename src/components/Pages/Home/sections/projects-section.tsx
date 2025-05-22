"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, useInView } from "framer-motion"
import {ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { translationsProject } from "../ConstData/ConstData"
import { ButtonSectionLink } from "@/components/SectionLinks"

export default function ProjectsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { language, direction } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction1, setDirection1] = useState(0) // -1 for left, 1 for right

  // Get current language content
  const content = translationsProject[language] || translationsProject["en"]

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setTimeout(() => {
      setDirection1(1)
      setActiveIndex((prev) => (prev === content.projects.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearTimeout(timer)
  }, [activeIndex, content.projects.length])

  const nextProject = () => {
    setDirection1(1)
    setActiveIndex((prev) => (prev === content.projects.length - 1 ? 0 : prev + 1))
  }

  const prevProject = () => {
    setDirection1(-1)
    setActiveIndex((prev) => (prev === 0 ? content.projects.length - 1 : prev - 1))
  }

  // Get visible projects for desktop view (3 at a time)
  const getVisibleProjects = () => {
    const totalProjects = content.projects.length
    if (totalProjects <= 3) return content.projects

    const projects = []
    for (let i = 0; i < 3; i++) {
      const index = (activeIndex + i) % totalProjects
      projects.push(content.projects[index])
    }
    return projects
  }

  // Variants for animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 },
    },
  }

  // Create a slug function to create URL-friendly links for projects
  const createSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }

  return (
    <section className="relative w-full py-20 overflow-hidden" id="projects" dir={direction}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/30"></div>

      <div className="absolute top-0 right-0 w-full h-40 bg-grid-pattern opacity-5 transform rotate-3"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-grid-pattern opacity-5 transform -rotate-3"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/3 left-0 w-96 h-96 rounded-full bg-digitek-purple blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {content.sectionTitle}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl"
          >
            {content.mainTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-muted-foreground text-lg"
          >
            {content.mainDescription}
          </motion.p>
        </div>

        {/* Desktop view: 3-card carousel */}
        <div className="hidden md:block relative">
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="grid grid-cols-3 gap-8"
              >
                {getVisibleProjects().map((project, index) => (
                  <ProjectCard
                    key={`${project.id}-${activeIndex}-${index}`}
                    project={project}
                    index={index}
                    isInView={true}
                    viewCaseStudyText={content.viewCaseStudy}
                    custom={direction1}
                  />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={prevProject}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">{content.previousProject}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={nextProject}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">{content.nextProject}</span>
            </Button>
          </div>

          {/* Progress bar */}
          <div className="mt-8 flex justify-center items-center gap-2">
            {content.projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection1(index > activeIndex ? 1 : -1)
                  setActiveIndex(index)
                }}
                className="group flex flex-col items-center"
              >
                <div className="relative h-1 w-8 bg-muted overflow-hidden rounded-full">
                  <motion.div
                    className="absolute inset-0 bg-primary rounded-full"
                    initial={{ width: index === activeIndex ? "100%" : "0%" }}
                    animate={{ width: index === activeIndex ? "100%" : "0%" }}
                    transition={index === activeIndex ? { duration: 5, ease: "linear" } : { duration: 0.3 }}
                  />
                </div>
                <span
                  className={`text-xs mt-1 ${index === activeIndex ? "text-primary" : "text-muted-foreground"} group-hover:text-primary transition-colors`}
                >
                  {index + 1}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Mobile view: Single card carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={activeIndex}
                initial={{ 
                  x: direction1 > 0 ? 300 : -300,
                  opacity: 0 
                }}
                animate={{
                  x: 0,
                  opacity: 1
                }}
                exit={{ 
                  x: direction1 > 0 ? -300 : 300,
                  opacity: 0 
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30
                }}
                className="w-full"
              >
                <ProjectCard
                  project={content.projects[activeIndex]}
                  index={0}
                  isInView={true}
                  viewCaseStudyText={content.viewCaseStudy}
                  custom={direction1}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation controls */}
          <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={prevProject}
            >
              <ChevronLeft className="h-5 w-5" />
              <span className="sr-only">{content.previousProject}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={nextProject}
            >
              <ChevronRight className="h-5 w-5" />
              <span className="sr-only">{content.nextProject}</span>
            </Button>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {content.projects.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection1(index > activeIndex ? 1 : -1)
                  setActiveIndex(index)
                }}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index ? "bg-primary w-8" : "bg-primary/30 hover:bg-primary/50"
                }`}
                aria-label={`${content.goToProject} ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        ></motion.div>
      </div>
    </section>
  )
}

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
    image: string
    category: string
    technologies: string[]
    color: string
  }
  index: number
  isInView: boolean
  viewCaseStudyText: string
  custom?: number
}

function ProjectCard({ project, index, isInView, viewCaseStudyText, custom = 0 }: ProjectCardProps) {
  const { direction } = useLanguage()
  const isRTL = direction === "rtl"

  // Create a slug function for project URL
  const createSlug = (title: string) => {
    return title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  };

  // Card animation variants
  const cardVariants = {
    hidden: {
      y: custom > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.9,
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
        delay: index * 0.15,
      },
    },
    exit: {
      y: custom > 0 ? -50 : 50,
      opacity: 0,
      scale: 0.9,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
    hover: {
      y: -10,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      whileHover="hover"
      className="group relative overflow-hidden rounded-2xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col"
    >
      {/* Animated gradient overlay */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 z-0`}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 0.05 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative overflow-hidden aspect-video">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        <div className="absolute top-4 left-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
          >
            <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${project.color}`}>
              {project.category}
            </span>
          </motion.div>
        </div>
      </div>

      <CardContent className="flex-grow p-6 z-10">
        <motion.h3
          className="text-xl font-bold mb-3 group-hover:text-primary transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 + index * 0.1, duration: 0.5 }}
        >
          {project.title}
        </motion.h3>

        <motion.p
          className="text-muted-foreground mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + index * 0.1, duration: 0.5 }}
        >
          {project.description}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
        >
          {project.technologies.map((tech, i) => (
            <Badge key={i} variant="secondary" className="font-normal">
              {tech}
            </Badge>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
        >
              <ButtonSectionLink 
              href={`/Pages/ProjectsDetailPage/${project.id}`} 
              className="group text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 bg-neutral-900 text-neutral-50 bg-gradient-to-tr from-digitek-pink to-digitek-purple shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-white dark:hover:bg-neutral-50/90"
                >
            {viewCaseStudyText}              

            <ArrowRight className={`${isRTL ? 'mr-1 md:mr-2 rotate-180' : 'ml-1 md:ml-2'} h-3 w-3 md:h-4 md:w-4 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </ButtonSectionLink>
          <Link
            href={`/Pages/ProjectsDetailPage/${project.id}`}
            className="inline-flex items-center text-primary font-medium hover:underline"
          >

          </Link>
        </motion.div>
      </CardContent>

      {/* Corner accent */}
      <motion.div
        className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${project.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3 + index * 0.1, duration: 0.6, type: "spring" }}
      ></motion.div>
    </motion.div>
  )
}