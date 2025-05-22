"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = "en" | "ar"
type Direction = "ltr" | "rtl"

// Define a recursive type for nested translations
interface TranslationItem {
  [key: string]: string | TranslationItem;
}

interface Translations {
  [language: string]: TranslationItem;
}

interface LanguageContextType {
  language: Language
  direction: Direction
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
  initialLanguage?: Language
}

export function LanguageProvider({ children, initialLanguage = "en" }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>(initialLanguage)
  const [direction, setDirection] = useState<Direction>(initialLanguage === "ar" ? "rtl" : "ltr")
  const [translations, setTranslations] = useState<Translations>({
    en: {},
    ar: {},
  })

  useEffect(() => {
    // Load translations
    const loadTranslations = async () => {
      try {
        // In a real app, you would import these from files
        // For this demo, we'll define them inline
       
      } catch (error) {
        console.error("Failed to load translations:", error)
      }
    }

    loadTranslations()
  }, [])

  useEffect(() => {
    // Update direction when language changes
    setDirection(language === "ar" ? "rtl" : "ltr")

    // Update document direction
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = language

    // Store language preference
    localStorage.setItem("language", language)
  }, [language])

  // Check for stored language preference on initial load
  useEffect(() => {
    const storedLanguage = localStorage.getItem("language") as Language | null
    if (storedLanguage && (storedLanguage === "en" || storedLanguage === "ar")) {
      setLanguage(storedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
  }

  const translate = (key: string): string => {
    if (!translations[language]) return key

    const keys = key.split(".")
    let result: any = translations[language]

    for (const k of keys) {
      if (result[k] === undefined) return key
      result = result[k]
    }

    return typeof result === "string" ? result : key
  }

  return (
    <LanguageContext.Provider
      value={{
        language,
        direction,
        setLanguage: handleSetLanguage,
        t: translate,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// English translations


// Arabic translations
const arTranslations = {


}