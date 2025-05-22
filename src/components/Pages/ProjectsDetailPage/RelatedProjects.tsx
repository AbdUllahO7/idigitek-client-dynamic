import React from "react"
import { Separator } from "@/components/ui/separator"
import { ProjectCard } from "./ProjectCard"
import { Project } from "./Projects"

interface RelatedProjectsProps {
  projects: Project[]
}

export const RelatedProjects: React.FC<RelatedProjectsProps> = ({ projects }) => {
  return (
    <section className="container px-4 md:px-6 mb-20">
      <div className="max-w-5xl mx-auto">
        <Separator className="mb-12" />
        <h2 className="text-2xl font-bold mb-8">Similar Projects</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}