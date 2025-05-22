import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import Footer from "@/components/layout/footer"
import Header from "@/components/layout/header"
import NavigationTracker from "@/components/NavigationTracker"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Idigitek Solutions - POS, Drive-Through & Software Development",
  description:
    "Innovative technology solutions for POS systems, drive-through operations, and custom software development.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>

          <LanguageProvider>
            <NavigationTracker/>
            <Header />
            {children}
            <Footer />

            </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

