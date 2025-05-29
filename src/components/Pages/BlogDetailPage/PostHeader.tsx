import React from "react"
import Image from "next/image"
import { Clock, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { formatDate } from "@/lib/utils"
import { GoBackButton } from "@/components/GoBackButton"

interface PostHeaderProps {
  blog: {
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
}

export const PostHeader: React.FC<PostHeaderProps> = ({ blog }) => {

    const { direction, language } = useLanguage()
  
  // Check if project.elements is not found or empty
  if (!blog?.elements || blog.elements.length === 0) {
    return null
  }

  // Helper function to get translated content
  const getTranslatedContent = (element: any, lang: string) => {
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

  // Extract fields from project subsection
  const titleElement = blog.elements.find((e) => e.name === "Title")
  const categoryElement = blog.elements.find((e) => e.name === "Category")
  const backLinkTextElement = blog.elements.find((e) => e.name === "Back Link Text")
  const dateElement = blog.elements.find((e) => e.name === "Date")


  // Get translated content based on current language
  const title = getTranslatedContent(titleElement, language)
  const category = getTranslatedContent(categoryElement, language)
  const backLinkText = getTranslatedContent(backLinkTextElement, language)
  const date = getTranslatedContent(dateElement, language)


  console.log("date" , date)

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
                <GoBackButton sectionName="blog" title={backLinkText}  />
    
      <div className={`flex items-center gap-3 mb-2 `}>
        <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r ${direction  === "rtl" ? "text-right" : ""} from-violet-600 to-indigo-600 text-white shadow-sm`}>
          {category}
        </span>
      </div>
      
      <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${direction  === "rtl" ? "text-right" : ""}`}>
        {title}
      </h1>
      
      <div className={`flex flex-wrap items-center gap-5 text-sm text-muted-foreground ${direction  === "rtl" ? "justify-end" : ""}`}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
              Published on {formatDate(new Date(date.toString()), "MMM d, yyyy") }
        </div>
        
      </div>
    </motion.div>
  )
}