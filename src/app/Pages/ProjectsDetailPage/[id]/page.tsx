"use client"

import { use } from "react"
import { useLanguage } from "@/contexts/language-context"
import { ProjectNotFound } from "@/components/Pages/ProjectsDetailPage/data/ProjectNotFound"
import { ProjectHero } from "@/components/Pages/ProjectsDetailPage/ProjectHero"
import { ProjectImage } from "@/components/Pages/ProjectsDetailPage/ProjectImage"
import { ProjectInfo } from "@/components/Pages/ProjectsDetailPage/ProjectInfo"
import { ProjectGallery } from "@/components/Pages/ProjectsDetailPage/ProjectGallery"
import { RelatedProjects } from "@/components/Pages/ProjectsDetailPage/RelatedProjects"
import { ProjectCTA } from "@/components/Pages/ProjectsDetailPage/ProjectCTA"
import { translationsProject } from "@/components/Pages/Home/ConstData/ConstData"
import { Project } from "@/components/Pages/ProjectsDetailPage/Projects"

// Helper function to map translationsProject data to the Project interface
const mapToProjectInterface = (project: any): Project => {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    image: project.image,
    category: project.category,
    technologies: project.technologies,
    color: project.color,
    client: project.client || "Client information not available",
    year: project.year || "2023",
    challenge: project.challenge || "Project challenge details not available",
    solution: project.solution || "Project solution details not available",
    results: project.results || "Project results not available",
    testimonial: project.testimonial || {
      quote: "Testimonial not available",
      author: "Client",
      role: "Organization"
    },
    gallery: project.gallery || []
  }
}

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { direction, language } = useLanguage()
  
  // Unwrap params with React.use()
  const resolvedParams = use(params)
  const projectId = resolvedParams.id
  
  // Use the correct data structure based on the imported translationsProject
  const currentLanguageProjects = translationsProject[language]?.projects || []
  
  // Find the current project and map it to match the Project interface
  const rawProject = currentLanguageProjects.find((project) => project.id === projectId)
  const currentProject = rawProject ? mapToProjectInterface(rawProject) : null

  // Find related projects (same category, excluding current) and map them to match the Project interface
  const relatedProjects = currentProject
    ? currentLanguageProjects
        .filter((project) => project.category === currentProject.category && project.id !== currentProject.id)
        .slice(0, 3)
        .map(mapToProjectInterface)
    : []

  // If project not found
  if (!currentProject) {
    return <ProjectNotFound />
  }

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <ProjectHero project={currentProject} />
      <ProjectImage project={currentProject} />
      <ProjectInfo project={currentProject} />
      <ProjectGallery project={currentProject} />
      {relatedProjects.length > 0 && (
        <RelatedProjects projects={relatedProjects} />
      )}
      <ProjectCTA />
    </div>
  )
}