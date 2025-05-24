import { useLanguage } from "@/contexts/language-context"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



  export const formatDate = (dateString , language) =>
    new Date(dateString).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")