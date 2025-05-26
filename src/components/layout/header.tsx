"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "@/components/ui/framer-motion"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { useRouter, usePathname } from "next/navigation"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function Header({ sectionId , logo }: { sectionId: string  , logo?: string }) {
  console.log("Header section id", sectionId)
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { language, direction } = useLanguage()
  const scrollToSection = useScrollToSection()
  const router = useRouter()
  const pathname = usePathname()
  const websiteId = localStorage.getItem("websiteId")
  



  // Create dynamic field mappings for nav items
  const createNavItemMappings = () => {
    const mappings: Record<string, string> = {}
    // Create mappings for multiple nav items (adjust the number as needed)
    for (let i = 1; i <= 13; i++) {
      mappings[`navitem${i}`] = `Nav Item ${i}`
      mappings[`navlink${i}`] = `Nav Link ${i}`
      mappings[`navorder${i}`] = `Nav Order ${i}`
    }
    return mappings
  }

  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
    sectionId: sectionId,
    websiteId,
    fieldMappings: createNavItemMappings()
  })


  // Process content items to create nav items
  const generateNavItemsFromDatabase = () => {
    if (!contentItems || contentItems.length === 0) {
      return []
    }

    const navItems: Array<{
      id: string
      href: string
      label: string
      order: number
    }> = []

    contentItems.forEach((item) => {
      // Extract all nav items from each content item
      for (let i = 1; i <= 13; i++) {
        const navItemName = item[`navitem${i}`]
        const navItemLink = item[`navlink${i}`]
        const navItemOrder = item[`navorder${i}`]

        if (navItemName && navItemName.trim() !== "") {
          navItems.push({
            id: navItemName.toLowerCase().replace(/\s+/g, ''),
            href: navItemLink && navItemLink.startsWith('#') ? navItemLink : `#${navItemName.toLowerCase().replace(/\s+/g, '')}`,
            label: navItemName,
            order: navItemOrder ? parseInt(navItemOrder) : i
          })
        }
      }
    })

    // Sort by order and remove duplicates
    return navItems
      .sort((a, b) => a.order - b.order)
      .filter((item, index, self) => 
        index === self.findIndex(t => t.id === item.id)
      )
  }

  const navItems = generateNavItemsFromDatabase()



  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Prevent scrolling when mobile menu is open
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

  // Check for hash in URL after page loads or changes
  useEffect(() => {
    // Check if there's a hash in the URL when the component mounts
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        // Remove the # character
        const sectionId = hash.substring(1);
        // Small timeout to ensure the page has fully loaded
        setTimeout(() => {
          scrollToSection(sectionId);
        }, 500);
      }
    }
  }, [pathname, scrollToSection]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault()
    
    // Get the current path and the home path
    const homePath = '/'
    const currentPath = pathname
    
    if (currentPath === homePath) {
      // If already on home page, just scroll to the section
      scrollToSection(sectionId)
    } else {
      // If on another page, navigate to home page with hash
      router.push(`/${sectionId !== 'home' ? `#${sectionId}` : ''}`)
    }
    
    setIsOpen(false)
  }

  // Show loading state while fetching nav items
  if (itemsLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/assets/iDIGITEK.webp"
                alt="iDIGITEK Logo"
                width={120}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>
          <div className="text-sm text-muted-foreground">Loading navigation...</div>
        </div>
      </header>
    );
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isOpen
          ? "bg-black border-gray-800"
          : scrolled
            ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-md"
            : "bg-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60"
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
              alt="iDIGITEK Logo"
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
                onClick={(e) => handleNavClick(e, item.id)}
                className="text-sm font-medium hover:text-primary"
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <LanguageToggle />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              
            </motion.div>
          </div>
        </nav>
      </div>
    </motion.header>
  )
}

interface MobileNavProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  navItems: { label: string; href: string; id: string; order: number }[]
  handleNavClick: (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => void
}

function MobileNav({ isOpen, setIsOpen, navItems, handleNavClick}: MobileNavProps) {
  const { direction } = useLanguage()

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={isOpen ? "text-white hover:text-white hover:bg-gray-800" : ""}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 top-16 z-50 bg-black h-full p-6"
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
                    className="text-lg font-medium text-white hover:text-primary"
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