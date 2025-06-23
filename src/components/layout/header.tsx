"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, ExternalLink } from "lucide-react"
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
  source: "navigation" | "section"
  isDynamicUrl?: boolean
}

interface NavItem {
  id: string
  href: string
  label: string
  order: number
  subNavItems: SubNavItem[]
  sectionName?: string
}

interface HeaderProps {
  sectionId: string
  websiteId?: string
  logo?: string
  subName?: string
  sectionsData?: any[]
}

export default function Header({
  sectionId,
  websiteId,
  logo = "/assets/iDIGITEK.webp",
  subName,
  sectionsData,
}: HeaderProps) {
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const router = useRouter()
  const pathname = usePathname()

  // Get websiteId from props or localStorage
  const actualWebsiteId = websiteId || (typeof window !== "undefined" ? localStorage.getItem("websiteId") : null)

  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [hoveredNavId, setHoveredNavId] = useState<string | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const { useGetNavigationByWebSiteId, useGetCompleteByWebSiteId } = useSubSections()
  const { data: sections } = useGetNavigationByWebSiteId(actualWebsiteId)
  const { data: allSections } = useGetCompleteByWebSiteId(actualWebsiteId)

  // Helper function to get translated content
  const getTranslatedContent = (element: any, language: string) => {
    const translation = element?.translations?.find((t: any) => t.language.languageID === language)
    return translation?.content || element?.defaultContent || ""
  }

  // Helper function to check if a section has addSubNavigation enabled
  const hasAddSubNavigation = (section: any) => {
    const allElements = [...(section.elements || []), ...(section.contentElements || [])]

    const addSubNavElement = allElements.find((el: any) => el.name === "Add SubNavigation" && el.type === "boolean")

    return addSubNavElement?.defaultContent === "true" || addSubNavElement?.defaultContent === true
  }

  // Helper function to get section title
  const getSectionTitle = (section: any, language: string) => {
    const allElements = [...(section.elements || []), ...(section.contentElements || [])]

    const titleElement = allElements.find((el: any) => el.name === "Title" && el.type === "text")

    return titleElement ? getTranslatedContent(titleElement, language) : ""
  }

  // Helper function to get dynamic URL from section
  const getDynamicUrl = (section: any) => {
    const allElements = [...(section.elements || []), ...(section.contentElements || [])]

    const dynamicUrlElement = allElements.find((el: any) => el.name === "Dynamic URL" && el.type === "text")

    return dynamicUrlElement?.defaultContent || null
  }

  // Helper function to generate fallback URL from section
  const generateFallbackSectionUrl = (section: any) => {
    return section.slug ? `#${section.slug}` : `#${section.name.toLowerCase().replace(/\s+/g, "-")}`
  }

  // Function to find sections with addSubNavigation enabled
  const getAdditionalSubNavItems = (parentSectionName: string, language: string): SubNavItem[] => {
    if (!allSections?.data) return []

    const filteredSections = allSections.data.filter((section: any) => {
      const hasSubNav = hasAddSubNavigation(section)
      if (!hasSubNav) return false
      return section.sectionItem?.section?.name === parentSectionName
    })

    return filteredSections
      .map((section: any) => {
        const dynamicUrl = getDynamicUrl(section)
        const fallbackUrl = generateFallbackSectionUrl(section)
        const finalUrl = dynamicUrl || fallbackUrl

        return {
          id: section._id,
          label: getSectionTitle(section, language),
          href: finalUrl,
          source: "section" as const,
          isDynamicUrl: !!dynamicUrl,
        }
      })
      .filter((item: SubNavItem) => item.label)
  }

  // Process navigation items from backend data
// Process navigation items from backend data, ordered by sectionsData
const navItems: NavItem[] = sectionsData
  ?.map((section: any) => {
    // Find matching subsection in navigation data
    const matchingSubsection = sections?.data?.find(
      (subsection: any) => subsection.section?.name === section.name || subsection.section?.subName === section.subName
    );

    if (!matchingSubsection) return null;

    const parentNameElement = matchingSubsection.elements.find((el: any) => el.name === "name");
    const parentUrlElement = matchingSubsection.elements.find((el: any) => el.name === "url");

    // Get existing sub-navigation items
    const existingSubNavItems = matchingSubsection.elements
      .filter((el: any) => el.metadata?.isSubNavigation && el.metadata?.fieldType === "title")
      .map((titleEl: any) => {
        const urlEl = matchingSubsection.elements.find(
          (el: any) =>
            el.metadata?.isSubNavigation &&
            el.metadata?.subNavId === titleEl.metadata?.subNavId &&
            el.metadata?.fieldType === "url"
        );
        return {
          id: titleEl._id,
          label: getTranslatedContent(titleEl, language),
          href: getTranslatedContent(urlEl, language) || "#",
          source: "navigation" as const,
          isDynamicUrl: false,
        };
      });

    const parentSectionName = matchingSubsection.section?.name;
    const additionalSubNavItems = getAdditionalSubNavItems(parentSectionName, language);
    const allSubNavItems = [...existingSubNavItems, ...additionalSubNavItems];

    return {
      id: matchingSubsection._id,
      href: getTranslatedContent(parentUrlElement, language) || "#",
      label: getTranslatedContent(parentNameElement, language),
      order: matchingSubsection.order,
      subNavItems: allSubNavItems,
      sectionName: parentSectionName,
    };
  })
  .filter((item: NavItem | null) => item !== null) || [];

  // Hover handlers with improved UX
  const handleMouseEnter = (navId: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setHoveredNavId(navId)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredNavId(null)
    }, 150)
  }

  const handleDropdownMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  const handleDropdownMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setHoveredNavId(null)
    }, 150)
  }

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Mobile menu body scroll lock
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

  // Handle initial scroll to section
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash || (subName ? `#${subName}` : "")
      if (hash) {
        const sectionId = hash.substring(1)
        setTimeout(() => {
          scrollToSection(sectionId)
        }, 500)
      }
    }
  }, [pathname, scrollToSection, subName])

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Find section ID by section name
  const findSectionIdBySectionName = (sectionName: string): string | null => {
    if (sectionsData && sectionsData.length > 0) {
      const matchingSection = sectionsData.find(
        (section: any) => section.name === sectionName || section.subName === sectionName,
      )

      if (matchingSection) {
        return matchingSection._id
      }
    }

    if (sections?.data) {
      const matchingNavSection = sections.data.find(
        (section: any) => section.section?.name === sectionName || section.section?.subName === sectionName,
      )

      if (matchingNavSection) {
        return matchingNavSection.section?._id
      }
    }

    return null
  }

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isDynamicUrl?: boolean,
    navItem?: NavItem,
  ) => {
    e.preventDefault()

    // Handle section navigation
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
      } else {
        if (pathname === "/") {
          scrollToSection(navItem.sectionName)
        } else {
          router.push(`/#${navItem.sectionName.toLowerCase()}`)
        }
        setIsOpen(false)
        return
      }
    }

    // Handle other navigation
    if (href !== "#") {
      if (isDynamicUrl) {
        window.open(href, "_self")
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
      className={`fixed top-0 left-0 right-0 z-50 w-full border-b border-wtheme-border transition-all duration-300 ${
        isOpen
          ? "bg-primary shadow-xl"
          : scrolled
            ? "bg-wtheme-background/95 backdrop-blur-md shadow-lg"
            : "bg-wtheme-background/80 backdrop-blur-sm"
      }`}
      dir={direction}
    >
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href="/" className="flex items-center">
              <Image
                src={logo || "/placeholder.svg"}
                alt="Logo"
                width={120}
                height={40}
                className={`h-8 w-auto transition-all duration-300 ${isOpen ? "brightness-0 invert" : ""}`}
              />
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative group"
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <Link
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, false, item)}
                  className="flex items-center gap-1  px-1 py-1 text-wtheme-text font-bold hover:text-wtheme-hover transition-colors duration-200"
                >
                  {item.label}
                  {item.subNavItems.length > 0 && (
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        hoveredNavId === item.id ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </Link>

                {/* Desktop Dropdown */}
                {item.subNavItems.length > 0 && (
                  <AnimatePresence>
                    {hoveredNavId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 mt-2 w-72 bg-wtheme-background shadow-xl rounded-lg border border-wtheme-border overflow-hidden"
                        onMouseEnter={handleDropdownMouseEnter}
                        onMouseLeave={handleDropdownMouseLeave}
                      >
                        <div className="py-2">
                          {item.subNavItems.map((subItem, index) => (
                            <motion.div
                              key={subItem.id}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                            >
                              <Link
                                href={subItem.href}
                                target={subItem.isDynamicUrl ? "_blank" : "_self"}
                                className={`flex items-center justify-between px-4 py-3 text-sm text-wtheme-text hover:bg-wtheme-hover/10 transition-colors duration-200 ${
                                  subItem.source === "section" ? "border-l-2 border-accent ml-2" : ""
                                }`}
                                onClick={(e) => handleNavClick(e, subItem.href, subItem.isDynamicUrl)}
                              >
                                <span className="flex-1">{subItem.label}</span>
                                <div className="flex items-center gap-2">
                                  {subItem.isDynamicUrl && <ExternalLink className="h-3 w-3 text-accent" />}
                                  {subItem.source === "section" && <div className="w-2 h-2 rounded-full bg-accent" />}
                                </div>
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            ))}
          </nav>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <LanguageToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className={`transition-colors duration-200 ${
                isOpen
                  ? "text-white hover:text-accent hover:bg-white/10"
                  : "text-wtheme-text hover:text-wtheme-hover hover:bg-wtheme-hover/10"
              }`}
            >
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.div>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navItems={navItems}
        handleNavClick={handleNavClick}
        direction={direction}
      />
    </motion.header>
  )
}

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  navItems: NavItem[]
  handleNavClick: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isDynamicUrl?: boolean,
    navItem?: NavItem,
  ) => void
  direction: string
}

function MobileNav({ isOpen, setIsOpen, navItems, handleNavClick, direction }: MobileNavProps) {
  const [openSubNav, setOpenSubNav] = useState<string | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-40 bg-primary overflow-y-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          dir={direction}
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="space-y-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div
                    className="flex items-center justify-between py-3 text-lg font-medium text-white hover:text-accent transition-colors duration-200 cursor-pointer"
                    onClick={(e) => {
                      if (item.subNavItems.length > 0) {
                        setOpenSubNav(openSubNav === item.id ? null : item.id)
                      } else {
                        handleNavClick(e as any, item.href, false, item)
                      }
                    }}
                  >
                    <span>{item.label}</span>
                    {item.subNavItems.length > 0 && (
                      <motion.div animate={{ rotate: openSubNav === item.id ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="h-5 w-5" />
                      </motion.div>
                    )}
                  </div>

                  {/* Mobile Submenu */}
                  <AnimatePresence>
                    {item.subNavItems.length > 0 && openSubNav === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="ml-4 space-y-2 border-l-2 border-accent/30 pl-4"
                      >
                        {item.subNavItems.map((subItem, subIndex) => (
                          <motion.div
                            key={subItem.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: subIndex * 0.05 }}
                          >
                            <Link
                              href={subItem.href}
                              target={subItem.isDynamicUrl ? "_blank" : "_self"}
                              className="flex items-center justify-between py-2 text-white/80 hover:text-accent transition-colors duration-200"
                              onClick={(e) => handleNavClick(e, subItem.href, subItem.isDynamicUrl)}
                            >
                              <span className="text-base">{subItem.label}</span>
                              <div className="flex items-center gap-2">
                                {subItem.isDynamicUrl && <ExternalLink className="h-4 w-4 text-accent" />}
                                {subItem.source === "section" && <div className="w-2 h-2 rounded-full bg-accent" />}
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Mobile Controls */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 + 0.2 }}
                className="flex items-center gap-4 pt-6 border-t border-white/20"
              >
                <ThemeToggle />
                <LanguageToggle />
              </motion.div>
            </nav>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
