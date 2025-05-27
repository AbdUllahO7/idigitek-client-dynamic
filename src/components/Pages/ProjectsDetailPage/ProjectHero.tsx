"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { GoBackButton } from "@/components/GoBackButton"
import { useLanguage } from "@/contexts/language-context"

interface ProjectHeroProps {
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

export const ProjectHero = ({ project, clients }: ProjectHeroProps) => {
  const headerRef = useRef(null)
  const isHeaderInView = useInView(headerRef, { once: true })
  const { language, direction } = useLanguage()



  // Helper function to get translated content
  const getTranslatedContent = (element: any, lang: string) => {
    if (!element) {
      return ""
    }
    if (!element.translations || !element.translations.length) {
      console.log(`No translations for element ${element.name}, using default: ${element.defaultContent}`)
      return element.defaultContent || ""
    }

    const translation = element.translations.find((t: any) => t.language.languageID === lang)
    const content = translation ? translation.content : element.defaultContent
    console.log(`Element ${element.name}:`, { lang, translation, content })
    return content || ""
  }

  // Extract fields from project subsection
  const titleElement = project?.elements?.find((e) => e.name === "Title")
  const descriptionElement = project?.elements?.find((e) => e.name === "Description")
  const categoryElement = project?.elements?.find((e) => e.name === "Category")
  const backLinkTextElement = project?.elements?.find((e) => e.name === "Back Link Text")

  // Extract fields from clients subsection
  const technologiesElement = clients?.elements?.find((e) => e.name === "Technologies")



  // Get translated content based on current language
  const title = getTranslatedContent(titleElement, language)
  const description = getTranslatedContent(descriptionElement, language)
  const category = getTranslatedContent(categoryElement, language)
  const backLinkText = getTranslatedContent(backLinkTextElement, language)
  const technologies = getTranslatedContent(technologiesElement, language)




  return (
    <section className="relative w-full py-20 overflow-hidden">
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
          <GoBackButton sectionName="projects" title={backLinkText || "Go Back"} />

          <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r from-digitek-orange to-digitek-pink`}>
                {category}
              </span>
          </div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6"
            >
              {title}
            </motion.h1>

          {description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-muted-foreground mb-6 whitespace-pre-line"
            >
              {description}
            </motion.p>
          )}

          {technologies && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              <span className="px-3 py-1 rounded-full text-xs font-medium text-white bg-gray-800">{technologies}</span>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}