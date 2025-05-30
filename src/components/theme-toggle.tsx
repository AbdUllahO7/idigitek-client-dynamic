"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"

export function ThemeToggle() {
  const { setTheme } = useTheme()
  const { t , language } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>{language === 'en' ? 'Light' : 'فاتح'}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>{language === 'en' ? 'Dark' : 'داكن'}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>{language === 'en' ? 'System' : 'النظام'}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

