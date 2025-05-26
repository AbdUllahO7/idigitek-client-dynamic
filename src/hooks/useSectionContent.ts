import { useLanguage } from "@/contexts/language-context"
import { useSectionItems } from "@/lib/sectionItems/use-sectionItems"
import { useSubSections } from "@/lib/subSections/use-subSections"
import { useMemo } from "react"

interface UseSectionContentProps<T extends { order?: number }> {
  sectionId: string
  websiteId: string
  fieldMappings: Record<string, string | ((subsection: any, index?: number) => any)>
  maxItemsPerSubsection?: number // For numbered fields (e.g., Hero 1, Hero 2)
  filter?: (item: T) => boolean
}

export function useSectionContent<T extends {
  id: any 
  order?: number 
}>({
  sectionId,
  websiteId,
  fieldMappings,
  maxItemsPerSubsection = 1,
  filter
}: UseSectionContentProps<T>) {
  const { language } = useLanguage()
  const { useGetBySectionId } = useSectionItems()
  const { useGetBySectionItemIds } = useSubSections()

  // Fetch section items
  const { data: sectionItems, error: sectionError } = useGetBySectionId(sectionId)
  const sectionItemIds = sectionItems?.data?.map(item => item._id) || []

  // Fetch subsections
  const { data: subSections, error: subSectionsError } = useGetBySectionItemIds(
    sectionItemIds,
    true, // activeOnly
    100, // limit
    0, // skip
    false // includeContentCount
  )

  // Transform subsections into content items
  const contentItems: T[] = useMemo(() => {
    if (!subSections?.data) return []

    const items: T[] = []

    subSections.data.forEach((subsection, subsectionIndex) => {
      // Determine how many items to extract from this subsection
      const iterations = maxItemsPerSubsection > 1 ? maxItemsPerSubsection : 1

      for (let i = 0; i < iterations; i++) {
        const item: Record<string, any> = {}

        let hasValidFields = false
        Object.entries(fieldMappings).forEach(([key, mapping]) => {
          if (typeof mapping === "function") {
            item[key] = mapping(subsection, i)
            if (item[key]) hasValidFields = true
            return
          }

          // Replace {index} in field names (e.g., "Hero {index} - Image" -> "Hero 1 - Image")
          const fieldName = maxItemsPerSubsection > 1 ? mapping.replace("{index}", String(i + 1)) : mapping

          if (fieldName === "_id") {
            item[key] = subsection._id
            hasValidFields = true
            return
          }

          if (fieldName === "createdAt") {
            item[key] = new Date(subsection.createdAt)
            hasValidFields = true
            return
          }

          const element = subsection.elements?.find(el => el.name === fieldName)
          if (element) {
            const getTranslation = (el, lang) =>
              el?.translations?.find(t => t.language.languageID === lang)?.content || el?.defaultContent || ""
            item[key] = element.type === "image" ? element.imageUrl || element.defaultContent || "" : getTranslation(element, language)
            if (item[key]) hasValidFields = true
          } else {
            item[key] = ""
          }
        })

        // Add order field if not explicitly mapped, ensuring type safety
        if (!("order" in item) && subsection.order !== undefined) {
          item.order = subsection.order ?? (subsectionIndex * iterations + i)
        }

        // Only add the item if it has valid fields and passes the filter
        if (hasValidFields && (!filter || filter(item as T))) {
          items.push(item as T)
        }
      }
    })

    // Sort items with type-safe access to order
    return items.sort((a, b) => {
      const aOrder = "order" in a ? a.order ?? 0 : 0
      const bOrder = "order" in b ? b.order ?? 0 : 0
      return aOrder - bOrder
    })
  }, [subSections, language, fieldMappings, maxItemsPerSubsection, filter])

  return {
    contentItems,
    isLoading: !subSections && !sectionItems,
    error: subSectionsError || sectionError
  }
}