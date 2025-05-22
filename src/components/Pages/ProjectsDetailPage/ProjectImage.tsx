import React from "react"
import Image from "next/image"
import { Project } from "./Projects"

interface ProjectImageProps {
  project: Project
}

export const ProjectImage: React.FC<ProjectImageProps> = ({ project }) => {
  return (
    <section className="container px-4 md:px-6 mb-12">
      <div className="max-w-5xl mx-auto">
        <div className="relative aspect-video rounded-2xl overflow-hidden">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.title}
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}