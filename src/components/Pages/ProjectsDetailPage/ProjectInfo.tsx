"use client"

import React from "react"
import { useLanguage } from "@/contexts/language-context"

interface ProjectInfoProps {
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

export const ProjectInfo: React.FC<ProjectInfoProps> = ({ project, clients }) => {
  const { language } = useLanguage()

  // Check if project.elements is not found or empty
  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Helper function to get translated content
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

  // Extract fields
  const clientElement = clients?.elements?.find((e) => e.name === "Client")
  const industryElement = clients?.elements?.find((e) => e.name === "Industry")
  const yearElement = clients?.elements?.find((e) => e.name === "Year")
  const technologiesElement = clients?.elements?.find((e) => e.name === "Technologies")

  const clientElementName = clients?.elements?.find((e) => e.name === "ClientName")
  const industryElementName = clients?.elements?.find((e) => e.name === "IndustryName")
  const yearElementName = clients?.elements?.find((e) => e.name === "YearName")
  const technologiesElementName = clients?.elements?.find((e) => e.name === "TechnologiesName")

  // Get translated content
  const client = getTranslatedContent(clientElement, language)
  const industry = getTranslatedContent(industryElement, language)
  const year = getTranslatedContent(yearElement, language)
  const technologiesString = getTranslatedContent(technologiesElement, language)

  const ClientName = getTranslatedContent(clientElementName, language)
  const IndustryName = getTranslatedContent(industryElementName, language)
  const YearName = getTranslatedContent(yearElementName, language)
  const TechnologiesName = getTranslatedContent(technologiesElementName, language)

  // Convert technologies string to array (split by comma or other delimiter)
  const technologies = technologiesString ? technologiesString.split(",").map((tech) => tech.trim()) : []

  // Don't render if no data
  if (!project || !clients || (!client && !industry && !year && !technologies.length)) {
    return null
  }

  return (
    <section className="container px-4 md:px-6 mb-12">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {client && (
            <div>
              <h3 className="text-lg font-heading  mb-2 text-primary">{ClientName}</h3>
              <p className="text-wtheme-text font-body">{client}</p>
            </div>
          )}
          {industry && (
            <div>
              <h3 className="text-lg font-heading text-primary mb-2 ">{IndustryName}</h3>
              <p className="text-wtheme-text font-body">{industry}</p>
            </div>
          )}
          {year && (
            <div>
              <h3 className="text-lg font-heading text-primary mb-2">{YearName}</h3>
              <p className="text-wtheme-text font-body">{year}</p>
            </div>
          )}
          {technologies.length > 0 && (
            <div>
              <h3 className="text-lg font-heading text-primary mb-2 s">{TechnologiesName}</h3>
              <div className="flex flex-wrap gap-1">
                {technologies.map((tech, i) => (
                  <span key={i} className="text-wtheme-text font-body text-sm">
                    {tech}
                    {i < technologies.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}