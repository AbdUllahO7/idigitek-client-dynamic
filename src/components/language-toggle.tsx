"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")} className={language === "en" ? "bg-muted" : ""}>
          {language === 'en' ? 'English' : "الإنجليزية"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("ar")} className={language === "ar" ? "bg-muted" : ""}>
        {language === 'en' ? 'Arabic' : "العربية"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

