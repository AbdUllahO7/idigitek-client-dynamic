import React, { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { GoBackButton } from "@/components/GoBackButton"
import { Project } from "./Projects"

interface ProjectHeroProps {
  project: Project
}

export const ProjectHero: React.FC<ProjectHeroProps> = ({ project }) => {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })

  return (
    <section className="relative w-full py-20 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-digitek-pink blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={headerRef} className="max-w-4xl mx-auto">
          <GoBackButton sectionName="projects" />

          <div className="flex items-center gap-3 mb-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${project.color}`}
            >
              {project.category}
            </span>
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-2" />
              {project.year}
            </div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
          >
            {project.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-muted-foreground mb-6"
          >
            {project.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            {project.technologies.map((tech, i) => (
              <Badge key={i} variant="secondary" className="font-normal">
                {tech}
              </Badge>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}