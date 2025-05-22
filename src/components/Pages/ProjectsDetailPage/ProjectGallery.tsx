import React from "react"
import Image from "next/image"
import { Project } from "./Projects"

interface ProjectGalleryProps {
  project: Project
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project }) => {
  return (
    <section className="container px-4 md:px-6">
      <div className="max-w-5xl mx-auto mb-12">
        <h3 className="text-2xl font-bold mb-6">Project Gallery</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {project.gallery.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image || "/placeholder.svg"}
                alt={`${project.title} gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}