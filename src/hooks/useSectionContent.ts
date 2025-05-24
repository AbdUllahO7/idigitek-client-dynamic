import { useLanguage } from "@/contexts/language-context"
import { useSectionItems } from "@/lib/sectionItems/use-sectionItems"
import { useSubSections } from "@/lib/subSections/use-subSections"

export function useSectionContent({
  sectionId,
  websiteId,
  fieldMappings
}: {
  sectionId: string
  websiteId: string
  fieldMappings: Record<string, any>
}) {
  const { language } = useLanguage()
  const { useGetBySectionId } = useSectionItems()
  const { useGetBySectionItemIds } = useSubSections()

  // Fetch section items
  const { data: sectionItems } = useGetBySectionId(sectionId)

  // Extract section item IDs
  const sectionItemIds = sectionItems?.data?.map(item => item._id) || []

  // Fetch subsections for all section item IDs
  const { data: subSections } = useGetBySectionItemIds(
    sectionItemIds,
    true, // activeOnly
    100, // limit
    0, // skip
    false // includeContentCount
  )

  // Transform subsections into content items
  const contentItems = subSections?.data?.map(subsection => {
    const getTranslation = (element, lang) => {
      const translation = element?.translations?.find(t => t.language.languageID === lang)
      return translation?.content || element?.defaultContent || ""
    }

    const getElementValue = (element, lang) => {
      // Check if this is an image element
      if (element?.type === "image") {
        // For image elements, prioritize imageUrl over translations/defaultContent
        return element?.imageUrl || element?.defaultContent || ""
      }
      
      // For non-image elements, use the regular translation logic
      return getTranslation(element, lang)
    }

    const item: Record<string, any> = {}

    Object.entries(fieldMappings).forEach(([key, mapping]) => {
      if (typeof mapping === "function") {
        // Handle computed fields (e.g., static values or derived data)
        item[key] = mapping(subsection)
        return
      }

      if (mapping.includes(".")) {
        // Handle nested properties (e.g., "sectionItem.name")
        const parts = mapping.split(".")
        let value = subsection
        for (const part of parts) {
          value = value?.[part]
          if (value === undefined) break
        }
        item[key] = value || ""
        return
      }

      if (mapping === "_id") {
        // Handle direct _id access
        item[key] = subsection._id
        return
      }

      if (mapping === "createdAt") {
        // Handle date fields
        item[key] = new Date(subsection.createdAt)
        return
      }

      // Handle element-based fields with translations
      const element = subsection.elements?.find(el => el.name === mapping)
      if (element) {
        item[key] = getElementValue(element, language)
      } else {
        item[key] = ""
      }
    })

    return item
  }) || []

  return {
    contentItems,
    isLoading: !subSections && !sectionItems,
    error: subSections?.error || sectionItems?.error
  }
}