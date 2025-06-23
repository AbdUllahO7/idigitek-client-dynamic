  export const getTranslatedContent = (element: any, lang: string) => {
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