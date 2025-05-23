import { useState, useEffect, useMemo } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useSubSections } from "@/lib/subSections/use-subSections"

export function useSectionLogic({
    sectionId,
    websiteId,
    fallbackTranslations = {}, // Fallback translations (e.g., translationsNews)
    itemsKey = "items", // Key for items in content (e.g., "news", "events")
}) {
  const { language, direction } = useLanguage()
  const { useGetBySectionId } = useSubSections()
  const [mainSectionElements, setMainSectionElements] = useState([])

  const {
    data: completeSubsectionsData,
    isLoading: isLoadingCompleteSubsections,
    error: completeSubsectionsError,
    refetch: refetchCompleteSubsections,
  } = useGetBySectionId(sectionId)

  // Extract main section data
  useEffect(() => {
    const extractMainSectionData = () => {
      const extractedData = []
      if (completeSubsectionsData && completeSubsectionsData.data) {
        const data = completeSubsectionsData.data
        if (data.isMain === true && Array.isArray(data.elements)) {
          data.elements.forEach((element) =>
            extractedData.push({
              name: element.name,
              translations: element.translations || [],
            })
          )
        } else if (Array.isArray(data.sections)) {
          const mainSection = data.sections.find((section) => section.isMain === true)
          if (mainSection && Array.isArray(mainSection.elements)) {
            mainSection.elements.forEach((element) =>
              extractedData.push({
                name: element.name,
                translations: element.translations || [],
              })
            )
          }
        } else if (Array.isArray(data)) {
          const mainSection = data.find((section) => section.isMain === true)
          if (mainSection && Array.isArray(mainSection.elements)) {
            mainSection.elements.forEach((element) =>
              extractedData.push({
                name: element.name,
                translations: element.translations || [],
              })
            )
          }
        } else if (Array.isArray(data.elements)) {
          data.elements.forEach((element) =>
            extractedData.push({
              name: element.name,
              translations: element.translations || [],
            })
          )
        }
      }
      return extractedData
    }

    if (completeSubsectionsData && completeSubsectionsData.data) {
      const extracted = extractMainSectionData()
      setMainSectionElements(extracted)
    }
  }, [completeSubsectionsData])

  // Process translations - This will now update when language changes
  const content = useMemo(() => {
    const getContent = () => {
      const content = {
        sectionLabel: "",
        sectionTitle: "",
        sectionDescription: "",
        readMore: "",
        [itemsKey]: [],
        error: fallbackTranslations[language]?.error || fallbackTranslations["en"]?.error || "Error loading content",
        retry: fallbackTranslations[language]?.retry || fallbackTranslations["en"]?.retry || "Retry",
        previous: fallbackTranslations[language]?.previousNews || fallbackTranslations["en"]?.previousNews || "Previous",
        next: fallbackTranslations[language]?.nextNews || fallbackTranslations["en"]?.nextNews || "Next",
      }

      mainSectionElements.forEach((element) => {
        const translation = element.translations.find(
          (t) => t.language.languageID === language
        ) || element.translations.find(
          (t) => t.language.languageID === "en"
        )
        
        if (translation) {
          switch (element.name) {
            case "Section Badge":
              content.sectionLabel = translation.content
              break
            case "Section Title":
              content.sectionTitle = translation.content
              break
            case "Section Description":
              content.sectionDescription = translation.content
              break
            case "news Details":
              content.readMore = translation.content
              break
          }
        }
      })

        // Fallback to provided translations
        const fallback = fallbackTranslations[language] || fallbackTranslations["en"] || {}
        content.sectionLabel = content.sectionLabel || fallback.sectionLabel || ""
        content.sectionTitle = content.sectionTitle || fallback.sectionTitle || ""
        content.sectionDescription = content.sectionDescription || fallback.sectionDescription || ""
        content.readMore = content.readMore || fallback.readMore || "Read More"
        content[itemsKey] = fallback[itemsKey] || []

      return content
    }

    return getContent()
  }, [mainSectionElements, language, fallbackTranslations, itemsKey]) // Dependencies that should trigger re-computation

  // Format date based on language
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")

  return {
    content,
    isLoading: isLoadingCompleteSubsections,
    error: completeSubsectionsError,
    refetch: refetchCompleteSubsections,
    language,
    direction,
    formatDate,
  }
}