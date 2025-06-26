"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Eye, ExternalLink, Maximize2, Minimize2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, File, FileImage, FileArchive, Share2, Globe, Files } from 'lucide-react'

interface ProjectFilesProps {
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
  clients?: {
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

interface FileData {
  element: any
  displayName: string
  fileUrl: string
  fileType: string
  language: string
}

export const ProjectFiles: React.FC<ProjectFilesProps> = ({ project, clients }) => {
  const { language } = useLanguage()
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [zoomLevel, setZoomLevel] = useState<number>(100)

  // Helper function to get translated content
  const getTranslatedContent = (element: any, lang: string): string => {
    if (!element) {
      return ""
    }
    if (!element.translations || !element.translations?.length) {
      return element.defaultContent || ""
    }

    const translation = element.translations?.find((t: any) => t.language.languageID === lang)
    const content = translation ? translation.content : element.defaultContent
    return content || ""
  }

  // Get file icon based on file type
  const getFileIcon = (fileUrl: string, mimeType?: string) => {
    const extension = fileUrl.split(".").pop()?.toLowerCase()
    const type = mimeType?.toLowerCase()

    if (type?.includes("pdf") || extension === "pdf") {
      return <FileText className="h-5 w-5" />
    }
    if (type?.includes("image") || ["jpg", "jpeg", "png", "gif", "svg"].includes(extension || "")) {
      return <FileImage className="h-5 w-5" />
    }
    if (["zip", "rar", "7z", "tar"].includes(extension || "")) {
      return <FileArchive className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  // Get file type for display
  const getFileType = (fileUrl: string, mimeType?: string): string => {
    const extension = fileUrl.split(".").pop()?.toLowerCase()
    const type = mimeType?.toLowerCase()

    if (type?.includes("pdf") || extension === "pdf") return "PDF"
    if (type?.includes("image")) return "Image"
    if (type?.includes("word") || ["doc", "docx"].includes(extension || "")) return "Word"
    if (type?.includes("excel") || ["xls", "xlsx"].includes(extension || "")) return "Excel"
    if (type?.includes("powerpoint") || ["ppt", "pptx"].includes(extension || "")) return "PowerPoint"
    if (["zip", "rar", "7z", "tar"].includes(extension || "")) return "Archive"
    return extension?.toUpperCase() || "File"
  }

  // Get all file elements for the current language
  const getLanguageFiles = (): FileData[] => {
    if (!project?.elements || project.elements.length === 0) {
      return []
    }

    const files: FileData[] = []

    // Find file elements that match the current language
    const fileElements = project.elements.filter(
      (element) => element.type === "file" && element.fileUrl && element.name.includes(language.toUpperCase()),
    )

    fileElements.forEach((element) => {
      // Extract display name from translations or element name
      const displayName =
        getTranslatedContent(element, language) ||
        element.defaultContent ||
        element.name.replace(/File \w+ \d+/, "").trim() ||
        `File ${files.length + 1}`

      files.push({
        element,
        displayName,
        fileUrl: element.fileUrl!,
        fileType: getFileType(element.fileUrl!, element.fileMimeType),
        language: language,
      })
    })

    return files
  }

  // Get files for current language
  const currentLanguageFiles = getLanguageFiles()

  // Set last file as selected by default (most recently added)
  useEffect(() => {
    if (currentLanguageFiles.length > 0 && !selectedFile) {
      setSelectedFile(currentLanguageFiles[currentLanguageFiles.length - 1])
    } else if (currentLanguageFiles.length === 0) {
      setSelectedFile(null)
    } else if (selectedFile && !currentLanguageFiles.find((f) => f.element._id === selectedFile.element._id)) {
      // If current selected file is not in the new language files, select the last one
      setSelectedFile(currentLanguageFiles[currentLanguageFiles.length - 1])
    }
  }, [currentLanguageFiles, language])

  // Handle file download
  const handleDownload = (file: FileData) => {
    const link = document.createElement("a")
    link.href = file.fileUrl
    link.download = `${file.displayName}.${file.fileUrl.split(".").pop()}`
    link.click()
  }

  // Handle file share
  const handleShare = (file: FileData) => {
    if (navigator.share) {
      navigator.share({
        title: file.displayName,
        url: file.fileUrl,
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(file.fileUrl)
    }
  }

  // Handle zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 25, 200))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 25, 50))
  }

  // Check if project.elements is not found or empty
  if (!project?.elements || project.elements.length === 0) {
    return null
  }

  // Don't render if no files
  if (currentLanguageFiles.length === 0) {
    return null
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
  

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar - Only show if multiple files */}
          {currentLanguageFiles.length > 1 && (
            <Card className="w-80 flex flex-col">
              <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <File className="h-4 w-4" />
                   ({currentLanguageFiles.length})
                </h3>
              </div>
              <CardContent className="flex-1 overflow-y-auto p-2">
                <div className="space-y-1">
                  {currentLanguageFiles.map((file, index) => (
                    <button
                      key={file.element._id}
                      className={`w-full text-left p-3 rounded-lg transition-all duration-200 group ${
                        selectedFile?.element._id === file.element._id
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 shadow-sm"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/50 border border-transparent"
                      }`}
                      onClick={() => setSelectedFile(file)}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 p-2 rounded-md transition-colors ${
                            selectedFile?.element._id === file.element._id
                              ? "bg-blue-100 dark:bg-blue-800/30 text-blue-600 dark:text-blue-400"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-600"
                          }`}
                        >
                          {getFileIcon(file.fileUrl, file.element.fileMimeType)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {file.displayName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{file.fileType}</p>
                        </div>
                        {selectedFile?.element._id === file.element._id && (
                          <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Viewer */}
          <Card className="flex-1 flex flex-col">
            {selectedFile && (
              <>
                {/* File Header */}
                <div className="p-4 border-b border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex-shrink-0">
                          {getFileIcon(selectedFile.fileUrl, selectedFile.element.fileMimeType)}
                        </div>
                        <div className="min-w-0">
                          <h2 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {selectedFile.displayName}
                          </h2>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {selectedFile.fileType}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* File Navigation */}
                      {currentLanguageFiles.length > 1 && (
                        <>
                          <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentIndex = currentLanguageFiles.findIndex(
                                  (f) => f.element._id === selectedFile.element._id,
                                )
                                const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentLanguageFiles.length - 1
                                setSelectedFile(currentLanguageFiles[prevIndex])
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm text-gray-600 dark:text-gray-400 px-2 font-medium">
                              {currentLanguageFiles.findIndex((f) => f.element._id === selectedFile.element._id) + 1} /{" "}
                              {currentLanguageFiles.length}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const currentIndex = currentLanguageFiles.findIndex(
                                  (f) => f.element._id === selectedFile.element._id,
                                )
                                const nextIndex = currentIndex < currentLanguageFiles.length - 1 ? currentIndex + 1 : 0
                                setSelectedFile(currentLanguageFiles[nextIndex])
                              }}
                              className="h-8 w-8 p-0"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                          <Separator orientation="vertical" className="h-6" />
                        </>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => window.open(selectedFile.fileUrl, "_blank")}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownload(selectedFile)}
                          className="h-8 w-8 p-0"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(selectedFile)}
                          className="h-8 w-8 p-0"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>

                        {/* Zoom Controls for PDFs */}
                        {selectedFile.fileType === "PDF" && (
                          <>
                            <Separator orientation="vertical" className="h-6" />
                            <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-700 rounded-lg p-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleZoomOut}
                                disabled={zoomLevel <= 50}
                                className="h-8 w-8 p-0"
                              >
                                <ZoomOut className="h-4 w-4" />
                              </Button>
                              <span className="text-sm text-gray-600 dark:text-gray-400 px-2 min-w-[50px] text-center font-medium">
                                {zoomLevel}%
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleZoomIn}
                                disabled={zoomLevel >= 200}
                                className="h-8 w-8 p-0"
                              >
                                <ZoomIn className="h-4 w-4" />
                              </Button>
                            </div>
                          </>
                        )}

                        <Separator orientation="vertical" className="h-6" />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setIsFullscreen(!isFullscreen)}
                          className="h-8 w-8 p-0"
                        >
                          {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File Content */}
                <CardContent
                  className={`flex-1 relative p-0 ${
                    isFullscreen ? "fixed inset-0 bg-white dark:bg-gray-900 z-50" : ""
                  }`}
                >
                  {/* Fullscreen Exit Button */}
                  {isFullscreen && (
                    <Button
                      className="absolute top-4 right-4 z-10 shadow-lg"
                      onClick={() => setIsFullscreen(false)}
                    >
                      <Minimize2 className="h-4 w-4 mr-2" />
                      Exit Fullscreen
                    </Button>
                  )}

                  {/* File Viewer */}
                  {selectedFile.fileType === "PDF" ? (
                    <iframe
                      src={`${selectedFile.fileUrl}#zoom=${zoomLevel}&view=FitH&toolbar=0&navpanes=0&scrollbar=1`}
                      className="w-full h-full border-0 rounded-b-lg"
                      title={`${selectedFile.displayName} Viewer`}
                    />
                  ) : selectedFile.fileType === "Image" ? (
                    <div className="w-full h-full flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                      <img
                        src={selectedFile.fileUrl || "/placeholder.svg"}
                        alt={selectedFile.displayName}
                        className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                        style={{
                          transform: `scale(${zoomLevel / 100})`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gray-50 dark:bg-gray-800 rounded-b-lg">
                      <Card className="max-w-md text-center">
                        <CardContent className="p-8">
                          <div className="text-gray-400 dark:text-gray-500 mb-4 flex justify-center">
                            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full">
                              {getFileIcon(selectedFile.fileUrl, selectedFile.element.fileMimeType)}
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                            {selectedFile.displayName}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                            This file type cannot be previewed in the browser. You can open it externally or download it.
                          </p>
                          <div className="flex gap-3 justify-center">
                            <Button
                              onClick={() => window.open(selectedFile.fileUrl, "_blank")}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Open File
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleDownload(selectedFile)}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
