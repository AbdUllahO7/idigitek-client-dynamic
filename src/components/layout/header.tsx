"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { useRouter, usePathname } from "next/navigation"
import { ThemeToggle } from "../theme-toggle"
import { useSubSections } from "@/lib/subSections/use-subSections"

interface SubNavItem {
  id: string
  label: string
  href: string
  source: 'navigation' | 'section' // Track where the sub-nav item came from
  isDynamicUrl?: boolean // Track if this uses a dynamic URL
}

interface NavItem {
  id: string
  href: string
  label: string
  order: number
  subNavItems: SubNavItem[]
  sectionName?: string // To match with sections that have addSubNavigation
}

interface HeaderProps {
  sectionId: string
  logo?: string
  subName?: string
  sectionsData?: any[] // Add sections data to find matching section IDs
}

export default function Header({ sectionId, logo = "/assets/iDIGITEK.webp", subName, sectionsData }: HeaderProps) {
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const router = useRouter()
  const pathname = usePathname()
  const websiteId = localStorage.getItem("websiteId")
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { useGetNavigationByWebSiteId, useGetCompleteByWebSiteId } = useSubSections()
  const { data: sections } = useGetNavigationByWebSiteId(websiteId)
  const { data: allSections } = useGetCompleteByWebSiteId(websiteId)

  // Debug logging for received data
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Header Debug - All Sections Data:', allSections)
      console.log('Header Debug - Navigation Sections Data:', sections)
      if (allSections?.data) {
        allSections.data.forEach((section: any, idx: number) => {
          // Check both elements and contentElements arrays for this section
          const allElements = [
            ...(section.elements || []),
            ...(section.contentElements || [])
          ]
          
          const addSubNavElement = allElements.find((el: any) => 
            el.name === "Add SubNavigation" && el.type === "boolean"
          )
          
          const dynamicUrlElement = allElements.find((el: any) => 
            el.name === "Dynamic URL" && el.type === "text"
          )
          
          console.log(`Section ${idx}:`, {
            id: section._id,
            name: section.name,
            addSubNavElement: addSubNavElement ? {
              name: addSubNavElement.name,
              type: addSubNavElement.type,
              defaultContent: addSubNavElement.defaultContent
            } : null,
            dynamicUrlElement: dynamicUrlElement ? {
              name: dynamicUrlElement.name,
              type: dynamicUrlElement.type,
              defaultContent: dynamicUrlElement.defaultContent
            } : null,
            elementsCount: section.elements?.length || 0,
            contentElementsCount: section.contentElements?.length || 0,
            sampleElements: section.elements?.slice(0, 5).map((el: any) => ({name: el.name, type: el.type, defaultContent: el.defaultContent?.substring(0, 50)})) || [],
            sampleContentElements: section.contentElements?.slice(0, 5).map((el: any) => ({name: el.name, type: el.type, defaultContent: el.defaultContent?.substring(0, 50)})) || []
          })
        })
      }
    }
  }, [allSections, sections])

  // Helper function to get translated content
  const getTranslatedContent = (element: any, language: string) => {
    const translation = element.translations?.find((t: any) => t.language.languageID === language)
    return translation?.content || element.defaultContent || ""
  }

  // Helper function to check if a section has addSubNavigation enabled
  const hasAddSubNavigation = (section: any) => {
    // Check both elements and contentElements arrays
    const allElements = [
      ...(section.elements || []),
      ...(section.contentElements || [])
    ]
    
    const addSubNavElement = allElements.find((el: any) => 
      el.name === "Add SubNavigation" && el.type === "boolean"
    )
    
    return addSubNavElement?.defaultContent === "true" || addSubNavElement?.defaultContent === true
  }

  // Helper function to get section title
  const getSectionTitle = (section: any, language: string) => {
    // Check both elements and contentElements arrays
    const allElements = [
      ...(section.elements || []),
      ...(section.contentElements || [])
    ]
    
    const titleElement = allElements.find((el: any) => 
      el.name === "Title" && el.type === "text"
    )
    
    return titleElement ? getTranslatedContent(titleElement, language) : ""
  }

  // Helper function to get dynamic URL from section
  const getDynamicUrl = (section: any) => {
    // Check both elements and contentElements arrays
    const allElements = [
      ...(section.elements || []),
      ...(section.contentElements || [])
    ]
    
    const dynamicUrlElement = allElements.find((el: any) => 
      el.name === "Dynamic URL" && el.type === "text"
    )
    
    // Debug logging (remove in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Section:', section.name || section._id)
      console.log('All elements:', allElements.map(el => ({ name: el.name, type: el.type, defaultContent: el.defaultContent })))
      console.log('Dynamic URL element found:', dynamicUrlElement)
      console.log('Dynamic URL value:', dynamicUrlElement?.defaultContent)
    }
    
    return dynamicUrlElement?.defaultContent || null
  }

  // Helper function to generate fallback URL from section
  const generateFallbackSectionUrl = (section: any) => {
    // Fallback URL generation when dynamic URL is not available
    return section.slug ? `#${section.slug}` : `#${section.name.toLowerCase().replace(/\s+/g, '-')}`
  }

  // Function to find sections with addSubNavigation enabled and use their dynamic URLs
  const getAdditionalSubNavItems = (parentSectionName: string, language: string): SubNavItem[] => {
    if (!allSections?.data) return []

    const filteredSections = allSections.data
      .filter((section: any) => {
        // Check if this section has addSubNavigation enabled
        const hasSubNav = hasAddSubNavigation(section)
        
        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log(`Section ${section.name || section._id}:`, {
            hasSubNav,
            parentSectionName,
            sectionParent: section.sectionItem?.section?.name,
            elements: section.elements?.map((el: any) => ({ name: el.name, type: el.type })) || [],
            contentElements: section.contentElements?.map((el: any) => ({ name: el.name, type: el.type })) || []
          })
        }
        
        if (!hasSubNav) return false
        
        // Check if this section belongs to the parent navigation
        // You might need to adjust this logic based on how you determine the relationship
        return section.sectionItem?.section?.name === parentSectionName
      })

    return filteredSections
      .map((section: any) => {
        // Try to get the dynamic URL first, fallback to generated URL
        const dynamicUrl = getDynamicUrl(section)
        const fallbackUrl = generateFallbackSectionUrl(section)
        const finalUrl = dynamicUrl || fallbackUrl
        
        // Debug logging (remove in production)
        if (process.env.NODE_ENV === 'development') {
          console.log(`Processing section ${section.name || section._id}:`, {
            dynamicUrl,
            fallbackUrl,
            finalUrl,
            title: getSectionTitle(section, language)
          })
        }
        
        return {
          id: section._id,
          label: getSectionTitle(section, language),
          href: finalUrl,
          source: 'section' as const,
          isDynamicUrl: !!dynamicUrl // Track if we're using a dynamic URL
        }
      })
      .filter((item: SubNavItem) => item.label) // Only include items with valid labels
  }

  // Process navigation items from backend data with additional sub-navigation
  const navItems: NavItem[] = sections?.data?.map((subsection: any) => {
    const parentNameElement = subsection.elements.find((el: any) => el.name === "name")
    const parentUrlElement = subsection.elements.find((el: any) => el.name === "url")
    
    // Get existing sub-navigation items from the navigation configuration
    const existingSubNavItems = subsection.elements
      .filter((el: any) => el.metadata?.isSubNavigation && el.metadata?.fieldType === "title")
      .map((titleEl: any) => {
        const urlEl = subsection.elements.find(
          (el: any) => el.metadata?.isSubNavigation && el.metadata?.subNavId === titleEl.metadata?.subNavId && el.metadata?.fieldType === "url"
        )
        return {
          id: titleEl._id,
          label: getTranslatedContent(titleEl, language),
          href: getTranslatedContent(urlEl, language) || "#",
          source: 'navigation' as const,
          isDynamicUrl: false
        }
      })
      .sort((a: SubNavItem, b: SubNavItem) => a.order - b.order)

    // Get the parent section name to find related sections with addSubNavigation
    const parentSectionName = subsection.section?.name

    // Get additional sub-navigation items from sections with addSubNavigation enabled
    const additionalSubNavItems = getAdditionalSubNavItems(parentSectionName, language)

    // Combine both types of sub-navigation items
    const allSubNavItems = [...existingSubNavItems, ...additionalSubNavItems]

    return {
      id: subsection._id,
      href: getTranslatedContent(parentUrlElement, language) || "#",
      label: getTranslatedContent(parentNameElement, language),
      order: subsection.order,
      subNavItems: allSubNavItems,
      sectionName: parentSectionName
    }
  }).sort((a: NavItem, b: NavItem) => a.order - b.order) || []

  // Improved hover handlers with timeout for better UX
  const handleMouseEnter = (navId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setHoveredNavId(navId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredNavId(null)
    }, 150) // 150ms delay before closing
  }

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredNavId(null)
    }, 150) // 150ms delay before closing
  }

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || (subName ? `#${subName}` : '')
      if (hash) {
        const sectionId = hash.substring(1)
        setTimeout(() => {
          scrollToSection(sectionId)
        }, 500)
      }
    }
  }, [pathname, scrollToSection, subName])

  // Cleanup timeout on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Function to find section ID by section name
  const findSectionIdBySectionName = (sectionName: string): string | null => {
    if (!sectionsData) return null
    
    const matchingSection = sectionsData.find((section: any) => 
      section.name === sectionName || section.subName === sectionName
    )
    
    return matchingSection?._id || null
  }

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string, isDynamicUrl?: boolean, navItem?: NavItem) => {
    e.preventDefault()
    
    // If href is "#" and we have a navItem with sectionName, try to scroll to the section
    if (href === "#" && navItem?.sectionName) {
      const sectionId = findSectionIdBySectionName(navItem.sectionName)
      if (sectionId) {
        if (pathname === "/") {
          scrollToSection(sectionId)
        } else {
          router.push(`/#${navItem.sectionName.toLowerCase()}`)
        }
        setIsOpen(false)
        return
      }
    }
    
    if (href !== "#") {
      if (isDynamicUrl) {
        // For dynamic URLs, open in new tab/window or navigate directly
        window.open(href, '_blank')
      } else if (href.startsWith("#")) {
        const sectionId = href.substring(1)
        if (pathname === "/") {
          scrollToSection(sectionId)
        } else {
          router.push(`/${href}`)
        }
      } else {
        router.push(href)
      }
    }
    setIsOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 px-16 w-full border-wtheme-border transition-all duration-300 ${
        isOpen
          ? "bg-primary"
          : scrolled
            ? "bg-wtheme-background/95 backdrop-blur supports-[backdrop-filter]:bg-wtheme-background shadow-primary"
            : "bg-wtheme-background/50 backdrop-blur supports-[backdrop-filter]:bg-wtheme-background"
      }`}
      dir={direction}
    >
      {/* FIXED: Removed container class and used full width with padding */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 flex h-16 items-center justify-between">
        <motion.div
          className="flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              width={120}
              height={40}
              className={`h-8 w-auto ${isOpen ? "brightness-200 contrast-200" : ""}`}
            />
          </Link>
        </motion.div>

        <MobileNav
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          navItems={navItems}
          handleNavClick={handleNavClick}
        />

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              className="relative group"
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, false, item)}
                className={`font-heading text-wtheme-text hover:text-wtheme-hover transition-colors ${
                  item.href === "#" ? "cursor-pointer" : ""
                }`}
              >
                {item.label}
              </Link>
              {item.subNavItems.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ 
                    opacity: hoveredNavId === item.id ? 1 : 0, 
                    y: hoveredNavId === item.id ? 0 : 10,
                    pointerEvents: hoveredNavId === item.id ? 'auto' : 'none'
                  }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-0 mt-1 w-64 bg-wtheme-background shadow-lg rounded-md overflow-hidden z-50 border border-wtheme-border"
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                >
                  {item.subNavItems.map((subItem) => (
                    <Link
                      key={subItem.id}
                      href={subItem.href}
                      target={subItem.isDynamicUrl ? "_blank" : "_self"}
                      className={`block px-4 py-3 text-sm text-wtheme-text hover:bg-wtheme-hover/10 transition-colors relative ${
                        subItem.source === 'section' ? 'border-l-2 border-accent' : ''
                      }`}
                      onClick={(e) => handleNavClick(e, subItem.href, subItem.isDynamicUrl)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{subItem.label}</span>
                        {subItem.isDynamicUrl && (
                          <span className="text-xs text-accent font-medium">🔗</span>
                        )}
                      </div>
                      {subItem.source === 'section' && !subItem.isDynamicUrl && (
                        <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
                          #
                        </span>
                      )}
                    </Link>
                  ))}
                </motion.div>
              )}
            </motion.div>
          ))}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  navItems: NavItem[]
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string, isDynamicUrl?: boolean, navItem?: NavItem) => void
}

function MobileNav({ isOpen, setIsOpen, navItems, handleNavClick }: MobileNavProps) {
  const { direction } = useLanguage()
  const [openSubNav, setOpenSubNav] = useState<string | null>(null)

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? "text-white hover:text-accent hover:bg-white/10" : "text-wtheme-text hover:text-wtheme-hover"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-16 z-50 bg-primary h-full p-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            dir={direction}
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item) => (
                <div key={item.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className={`text-lg font-body font-medium text-white hover:text-accent transition-colors ${
                        item.href === "#" && item.subNavItems.length === 0 ? "cursor-pointer" : ""
                      }`}
                      onClick={(e) => {
                        if (item.subNavItems.length > 0) {
                          setOpenSubNav(openSubNav === item.id ? null : item.id)
                        } else if (item.href !== "#") {
                          handleNavClick(e as any, item.href)
                        } else {
                          // Handle parent nav click when href is "#"
                          handleNavClick(e as any, item.href, false, item)
                        }
                      }}
                    >
                      {item.label}
                      {item.subNavItems.length > 0 && (
                        <span className="ml-2 text-sm">
                          {openSubNav === item.id ? '▼' : '▶'}
                        </span>
                      )}
                    </div>
                  </motion.div>
                  {item.subNavItems.length > 0 && (
                    <AnimatePresence>
                      {openSubNav === item.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="ml-4 mt-2 flex flex-col gap-2"
                        >
                          {item.subNavItems.map((subItem) => (
                            <Link
                              key={subItem.id}
                              href={subItem.href}
                              target={subItem.isDynamicUrl ? "_blank" : "_self"}
                              className={`text-sm text-white/80 hover:text-accent transition-colors flex items-center justify-between ${
                                subItem.source === 'section' ? 'pl-2 border-l border-accent/50' : ''
                              }`}
                              onClick={(e) => handleNavClick(e, subItem.href, subItem.isDynamicUrl)}
                            >
                              <span>{subItem.label}</span>
                              <div className="flex items-center gap-1">
                                {subItem.isDynamicUrl && (
                                  <span className="text-xs text-accent">🔗</span>
                                )}
                                {subItem.source === 'section' && (
                                  <span className="text-xs text-accent">●</span>
                                )}
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4">
                <ThemeToggle />
                <LanguageToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}