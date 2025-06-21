"use client"

import type React from "react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Eye, ExternalLink, Maximize2, Minimize2, RotateCw, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectInfoProps {
  project: {
    _id: string
    elements: {
      _id: string
      name: string
      type: string
      defaultContent: string
      fileUrl?: string
      fileMimeType?: string
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
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [zoomLevel, setZoomLevel] = useState<number>(100)
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

  // Get the appropriate PDF file based on language
  const getPdfElement = () => {
    const languageMap: { [key: string]: string } = {
      en: "Uploaded File EN",
      ar: "Uploaded File AR",
      tr: "Uploaded File TR",
    }

    const pdfElementName = languageMap[language] || "Uploaded File EN"
    return project.elements.find((e) => e.name === pdfElementName && e.type === "file")
  }

  // Extract fields for other info
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

  // Convert technologies string to array
  const technologies = technologiesString ? technologiesString.split(",").map((tech) => tech.trim()) : []

  // Get PDF element
  const pdfElement = getPdfElement()

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
  }

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50))
  }

  // Handle page navigation
  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => prev + 1)
  }

  // Don't render if no data
  if (!project || !clients || (!client && !industry && !year && !technologies.length && !pdfElement)) {
    return null
  }

  return (
    <section className="container px-4 md:px-6 mb-12">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Project Info Grid */}
        <Card className="shadow-none border-0 ">
          <CardContent className="shadow-0 border-0 bg-wtheme-background">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {client && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-wtheme-text uppercase tracking-wide">{ClientName}</h3>
                  <p className="text-lg font-semibold text-wtheme-text">{client}</p>
                </div>
              )}
              {industry && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-wtheme-text uppercase tracking-wide">{IndustryName}</h3>
                  <p className="text-lg font-semibold text-wtheme-text">{industry}</p>
                </div>
              )}
              {year && (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-wtheme-text uppercase tracking-wide">{YearName}</h3>
                  <p className="text-lg font-semibold text-wtheme-text">{year}</p>
                </div>
              )}
              {technologies.length > 0 && (
                <div className="space-y-2 bg-wtheme-background">
                  <h3 className="text-sm font-medium text-wtheme-text uppercase tracking-wide bg-wtheme-background">{TechnologiesName}</h3>
                  <div className="flex flex-wrap gap-1 bg-wtheme-background">
                    {technologies.map((tech, i) => (
                      <Badge key={i}  className="text-xs bg-wtheme-background border-0 shadow-none">
                        <span className="bg-wtheme-background text-wtheme-text">{tech}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Large PDF Editor/Viewer Section */}
        {pdfElement?.fileUrl && (
          <>
            <Separator className="my-8" />
            
            {/* PDF Editor Controls */}
            <Card className="shadow-lg ">
              <CardHeader className="pb-4">
               
                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="default"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open(pdfElement.fileUrl, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = pdfElement.fileUrl
                      link.download = "project-document.pdf"
                      link.click()
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download PDF
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      navigator.share?.({
                        title: "Project Document",
                        url: pdfElement.fileUrl,
                      })
                    }
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                {/* Large PDF Viewer */}
                <div
                  className={`relative bg-gray-100 transition-all duration-300 ${
                    isFullscreen 
                      ? "fixed inset-0 bg-black" 
                      : "rounded-b-lg overflow-hidden"
                  }`}
                  style={{
                         height: isFullscreen ? "100vh" : "120vh",
                        minHeight: isFullscreen ? "100vh" : "900px",
                  }}
                >
                  {/* Fullscreen Exit Button */}
                 
                  {/* PDF Iframe */}
                  <iframe
                    src={`${pdfElement.fileUrl}#page=${currentPage}&zoom=${zoomLevel}&toolbar=1&navpanes=1&scrollbar=1`}
                    width="100%"
                    height="100%"
                    className={`border-0 min-h-[120vh] ${isFullscreen ? "bg-white" : "rounded-b-lg"}`}
                    title="Project Document Viewer"
                    style={{
                      transform: `scale(${zoomLevel / 100})`,
                      transformOrigin: "top left",
                      width: `${10000 / zoomLevel}%`,
                      height: `${10000 / zoomLevel}%`
                    }}
                  />

                  {/* Loading Overlay */}
                
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </section>
  )
}