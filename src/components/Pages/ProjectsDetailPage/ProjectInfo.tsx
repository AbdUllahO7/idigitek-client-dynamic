import React from "react"
import { Project } from "./Projects"

interface ProjectInfoProps {
  project: Project
}

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project }) => {
  return (
    <section className="container px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-lg font-semibold mb-2">Client</h3>
            <p className="text-muted-foreground">{project.client}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Industry</h3>
            <p className="text-muted-foreground">{project.category}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Year</h3>
            <p className="text-muted-foreground">{project.year}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Technologies</h3>
            <div className="flex flex-wrap gap-1">
              {project.technologies.map((tech, i) => (
                <span key={i} className="text-muted-foreground text-sm">
                  {tech}
                  {i < project.technologies.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}