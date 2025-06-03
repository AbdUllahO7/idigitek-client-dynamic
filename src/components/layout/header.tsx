"use client"

import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { useRouter, usePathname } from "next/navigation"
import { useSectionContent } from "@/hooks/useSectionContent"
import { ThemeToggle } from "../theme-toggle"

interface NavItem {
  id: string
  href: string
  label: string
  order: number
}

interface HeaderProps {
  sectionId: string
  logo?: string
  subName?: string
}

export default function Header({ sectionId, logo = "/assets/iDIGITEK.webp", subName }: HeaderProps) {
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const router = useRouter()
  const pathname = usePathname()
  const websiteId = localStorage.getItem("websiteId")
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Define field mappings for navigation items with dynamic {index}
  const navFieldMappings = {
      id: (subsection: any, index?: number) =>
        subsection.elements?.find(el => el.name === `Nav Item ${index !== undefined ? index + 1 : 1}`)?.defaultContent
          ?.toLowerCase()
          .replace(/\s+/g, '') || `${subsection._id}-${index || 0}`,
      label: "Nav Item {index}",
      href: (subsection: any, index?: number) => {
        const link = subsection.elements?.find(el => el.name === `Nav Link ${index !== undefined ? index + 1 : 1}`)?.defaultContent || ""
        return link.startsWith('#') ? link : `#${subsection.elements?.find(el => el.name === `Nav Item ${index !== undefined ? index + 1 : 1}`)?.defaultContent?.toLowerCase().replace(/\s+/g, '') || ''}`
      },
      order: (subsection: any, index?: number) => {
        const order = subsection.elements?.find(el => el.name === `Nav Order ${index !== undefined ? index + 1 : 1}`)?.defaultContent
        return order ? parseInt(order) : (index || 0)
    }
  }

  // Filter valid navigation items
  const navFilter = (item: NavItem) => item.label && item.label.trim() !== ""

  const { contentItems: navItems, isLoading, error } = useSectionContent<NavItem>({
    sectionId,
    websiteId,
    fieldMappings: navFieldMappings,
    maxItemsPerSubsection: 13,
    filter: navFilter
  })

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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    const homePath = '/'
    const currentPath = pathname

    const targetSectionId = subName && sectionId === subName ? subName : sectionId

    if (currentPath === homePath) {
      scrollToSection(targetSectionId)
    } else {
      router.push(`/${targetSectionId !== 'home' ? `#${targetSectionId}` : ''}`)
    }
    setIsOpen(false)
  }

  if (isLoading || error) {
    return (
      <header className="sticky top-0 z-50 w-full border-wtheme-border bg-wtheme-background backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="text-sm text-wtheme-text/70">
            {isLoading ? "Loading navigation..." : "No navigation available"}
          </div>
        </div>
      </header>
    )
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full border-wtheme-border transition-all duration-300 ${
        isOpen
          ? "bg-primary"  // UPDATED: Use website theme primary color for mobile menu
          : scrolled
            ? "bg-wtheme-background/95 backdrop-blur supports-[backdrop-filter]:bg-wtheme-background shadow-primary"  // UPDATED: Website theme background + primary shadow
            : "bg-wtheme-background/50 backdrop-blur supports-[backdrop-filter]:bg-wtheme-background"  // UPDATED: Website theme background
      }`}
      dir={direction}
    >
      
      <div className="container flex h-16 items-center justify-between">
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
          {navItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ y: -2 }}
            >
              <Link
                href={item.href}
                onClick={(e) => handleNavClick(e, subName && subName === item.label ? subName : item.id)}
                className=" font-heading text-wtheme-text  transition-colors"  // UPDATED: Website theme fonts and colors
              >
                {item.label}
              </Link>
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
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void
}

function MobileNav({ isOpen, setIsOpen, navItems, handleNavClick }: MobileNavProps) {
  const { direction } = useLanguage()

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? "text-white hover:text-accent hover:bg-white/10" : "text-wtheme-text hover:text-primary"}  // UPDATED: Website theme colors
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-16 z-50 bg-primary h-full p-6"  // UPDATED: Use website theme primary color
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            dir={direction}
          >
            <nav className="flex flex-col gap-6">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <Link
                    href={item.href}
                    className="text-lg font-body font-medium text-white hover:text-accent transition-colors"  // UPDATED: Website theme fonts and accent color on hover
                    onClick={(e) => handleNavClick(e, item.id)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
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