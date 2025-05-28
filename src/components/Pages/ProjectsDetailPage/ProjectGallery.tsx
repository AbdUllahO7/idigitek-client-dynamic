"use client"

import React from "react"
import Image from "next/image"
import { useLanguage } from "@/contexts/language-context"

interface ProjectGalleryProps {
  project: {
    _id: string
    elements: {
      _id: string
      name: string
      type: string
      defaultContent: string
      translations: {
        _id: string
        content: string
        language: {
          languageID: string
        }
      }[]
    }[]
  }
  clients: {
    _id?: string
    elements: {
      _id: string
      name: string
      type: string
      defaultContent: string
      imageUrl?: string
      translations: {
        _id: string
        content: string
        language: {
          languageID: string
        }
      }[]
    }[]
  }
}

export const ProjectGallery: React.FC<ProjectGalleryProps> = ({ project, clients }) => {
  const { language, direction } = useLanguage()

  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Helper function to get translated content (for title)
  const getTranslatedContent = (element: any, lang: string): string => {
    if (!element) {
      return ""
    }
    if (!element.translations || !element.translations.length) {
      return element.defaultContent || ""
    }

    const translation = element.translations.find((t: any) => t.language.languageID === lang)
    const content = translation ? translation.content : element.defaultContent
    return content || ""
  }

  const titleElement = project.elements.find((e) => e.name === "Title")
    const galleryTextElement = project.elements.find((e) => e.name === "Gallery Text")

  const title = getTranslatedContent(titleElement, language) || "Project"
  const galleryText = getTranslatedContent(galleryTextElement, language) || "Project"

  const imageElements = clients?.elements?.filter((e) => e.type === "image") || []
  const images = imageElements.map((e) => ({
    url: e.imageUrl || e.defaultContent || "/placeholder.svg",
    name: e.name,
  }))

  // Don't render if no images
  if (!images.length) {
    return null
  }

  return (
    <section className="container px-4 md:px-6">
      <div className="max-w-5xl mx-auto mb-12">
        <h3 className="text-2xl font-bold mb-6">{galleryText}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={`${title} gallery image ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 300px"
                priority={index < 2} // Prioritize first two images for faster loading
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}