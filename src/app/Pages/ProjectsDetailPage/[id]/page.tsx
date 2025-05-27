"use client"

import { use } from "react"
import { useLanguage } from "@/contexts/language-context"
import { ProjectNotFound } from "@/components/Pages/ProjectsDetailPage/data/ProjectNotFound"
import { ProjectHero } from "@/components/Pages/ProjectsDetailPage/ProjectHero"
import { ProjectImage } from "@/components/Pages/ProjectsDetailPage/ProjectImage"
import { useSubSections } from "@/lib/subSections/use-subSections"
import { ProjectInfo } from "@/components/Pages/ProjectsDetailPage/ProjectInfo"
import { ProjectGallery } from "@/components/Pages/ProjectsDetailPage/ProjectGallery"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const projectId = resolvedParams.id

  const { direction, language } = useLanguage()
  const { useGetBySectionItemIds, useGetCompleteById } = useSubSections()

  const { data: projectData, error: projectError } = useGetCompleteById(projectId)
  const { data: sectionData, error: sectionError } = useGetBySectionItemIds([projectData?.data?.sectionItem?._id])

  // Handle errors or loading states
  if (projectError || sectionError) {
    console.error("Errors:", projectError, sectionError)
    return <ProjectNotFound />
  }
  if (!projectData || !sectionData) {
    console.log("Data not loaded yet")
    return <div>Loading...</div>
  }

  // Find the main project section and clients section from the data
  const projectSection = sectionData?.data.find((section: any) =>
    section.elements.some((element: any) => element.name === "Title")
  )

  const clientsSection = sectionData?.data.find((section: any) =>
    section.elements.some((element: any) => element.name === "Technologies")
  )

  console.log("Project Section:", projectSection)
  console.log("Clients Section:", clientsSection)
  console.log("Section Data:", sectionData)

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      <ProjectHero project={projectSection} clients={clientsSection || { elements: [] }} />
      <ProjectImage project={projectSection} />
      <ProjectInfo project={projectSection} clients={clientsSection || { elements: [] }} />
      <ProjectGallery project={projectSection} clients={clientsSection || { elements: [] }} />
    </div>
  )
}