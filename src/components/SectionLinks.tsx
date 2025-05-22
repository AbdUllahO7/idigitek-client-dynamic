'use client'

import * as React from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { useScrollToSection } from "@/hooks/use-scroll-to-section"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Slot } from "@radix-ui/react-slot"
import { type VariantProps } from "class-variance-authority"

export interface ButtonSectionLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof buttonVariants> {
  href: string
  children: React.ReactNode
  asChild?: boolean
}

/**
 * Enhanced section link component that has button styling
 * Handles both internal section navigation and external navigation 
 * to a section on the home page
 */
const ButtonSectionLink = React.forwardRef<HTMLAnchorElement, ButtonSectionLinkProps>(
  ({ href, children, className, variant, size, asChild = false, onClick, ...props }, ref) => {
    const router = useRouter()
    const pathname = usePathname()
    const scrollToSection = useScrollToSection()
    
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      
      // Custom onClick handler if provided
      if (onClick) {
        onClick(e)
        return
      }
      
      // Handle section links starting with #
      if (href.startsWith('#')) {
        const sectionId = href.substring(1)
        
        if (pathname === '/') {
          // If on home page, scroll to section
          scrollToSection(sectionId)
        } else {
          // If not on home page, navigate to home with hash
          router.push(`/${href}`)
        }
      } else {
        // Regular navigation
        router.push(href)
      }
    }
    
    const Comp = asChild ? Slot : Link
    
    return (
      <Comp
        href={href}
        onClick={handleClick}
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </Comp>
    )
  }
)

ButtonSectionLink.displayName = "ButtonSectionLink"

export { ButtonSectionLink }