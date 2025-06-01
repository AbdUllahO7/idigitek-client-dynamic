"use client"
import { WebSiteTheme } from '@/api/types/WebSite/useWebSiteTheme'
import { useWebSiteThemes } from '@/lib/webSite/use-Theme'
import { useWebSite } from '@/lib/webSite/use-WebSite'
import React, { createContext, useContext, useEffect, useState } from 'react'

interface WebsiteThemeContextType {
  activeTheme: WebSiteTheme | null
  isLoading: boolean
  error: string | null
  refreshTheme: () => void
  setWebsiteId: (id: string) => void
  currentWebsiteId: string | null
}

const WebsiteThemeContext = createContext<WebsiteThemeContextType | undefined>(undefined)

interface WebsiteThemeProviderProps {
  children: React.ReactNode
}

// Helper function to safely access localStorage
function getStoredWebsiteId(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('websiteId')
  }
  return null
}

function setStoredWebsiteId(id: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('websiteId', id)
  }
}

export function WebsiteThemeProvider({ children }: WebsiteThemeProviderProps) {
  const { useGetWebsitesByUserId } = useWebSite();
  const { data: websites, isLoading: websitesLoading, error: websitesError } = useGetWebsitesByUserId();
  
  // Initialize currentWebsiteId with null to avoid hydration issues
  const [currentWebsiteId, setCurrentWebsiteId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Initialize websiteId from localStorage or websites data after component mounts
  useEffect(() => {
    const storedWebsiteId = getStoredWebsiteId()
    const websiteId = websites && websites.length > 0 ? websites[0].id : undefined
    
    if (storedWebsiteId) {
      setCurrentWebsiteId(storedWebsiteId)
    } else if (websiteId) {
      setCurrentWebsiteId(websiteId)
      setStoredWebsiteId(websiteId)
    }
    
    setIsInitialized(true)
  }, [websites])

  // Update localStorage when websiteId changes
  useEffect(() => {
    if (currentWebsiteId) {
      setStoredWebsiteId(currentWebsiteId)
    }
  }, [currentWebsiteId])

  const { useGetActiveTheme } = useWebSiteThemes()
  
  // DEBUG: Log current website ID
  console.log('🔍 Current Website ID:', currentWebsiteId)
  
  // Only fetch theme if we have a websiteId and component is initialized
  const { data: themeData, isLoading, error, refetch } = useGetActiveTheme(currentWebsiteId || '', {
    enabled: !!currentWebsiteId && isInitialized, // Only enable query when we have a websiteId and are initialized
    retry: 1,
    onError: (err) => {
      console.error('❌ Theme fetch error:', err)
    },
    onSuccess: (data) => {
      console.log('✅ Theme fetch success:', data)
    }
  })
  
  // DEBUG: Log all hook return values
  console.log('🎨 Theme Hook Data:', {
    themeData,
    isLoading,
    error,
    hasWebsiteId: !!currentWebsiteId,
    isInitialized
  })
  
  const [activeTheme, setActiveTheme] = useState<WebSiteTheme | null>(null)

  // Extract theme from API response
  useEffect(() => {
    console.log('🔄 Theme data changed:', themeData)
    
    if (themeData?.data) {
      console.log('✅ Setting active theme:', themeData.data.themeName)
      setActiveTheme(themeData.data)
    } else if (!currentWebsiteId) {
      console.log('🚫 Clearing theme - no website selected')
      setActiveTheme(null)
    } else if (currentWebsiteId && !isLoading && !themeData && isInitialized) {
      console.log('⚠️ No theme data for website:', currentWebsiteId)
    }
  }, [themeData, currentWebsiteId, isLoading, isInitialized])

  // Apply theme to CSS custom properties
  useEffect(() => {
    // Only apply theme after component is initialized to avoid SSR issues
    if (!isInitialized) return
    
    if (activeTheme) {
      console.log('🎨 Applying theme to CSS:', activeTheme.themeName)
      applyThemeToCSS(activeTheme)
    } else {
      console.log('🔄 Resetting to default theme')
      resetToDefaultTheme()
    }
  }, [activeTheme, isInitialized])

  const refreshTheme = () => {
    console.log('🔄 Refreshing theme for website:', currentWebsiteId)
    if (currentWebsiteId) {
      refetch()
    }
  }

  const setWebsiteId = (id: string) => {
    console.log('🆔 Setting website ID:', id)
    setCurrentWebsiteId(id)
  }

  const contextValue: WebsiteThemeContextType = {
    activeTheme,
    isLoading: isLoading || !isInitialized,
    error: error?.message || null,
    refreshTheme,
    setWebsiteId,
    currentWebsiteId
  }

  return (
    <WebsiteThemeContext.Provider value={contextValue}>
      {children}
    </WebsiteThemeContext.Provider>
  )
}

// Hook to use website theme context
export function useWebsiteTheme() {
  const context = useContext(WebsiteThemeContext)
  if (context === undefined) {
    throw new Error('useWebsiteTheme must be used within a WebsiteThemeProvider')
  }
  return context
}

// Function to apply theme to CSS custom properties
function applyThemeToCSS(theme: WebSiteTheme) {
  // Ensure we're in the browser environment
  if (typeof window === 'undefined') return
  
  const root = document.documentElement

  console.log('🎨 Applying theme colors:', theme.colors)

  // Apply color variables
  root.style.setProperty('--website-theme-primary', theme.colors.primary)
  root.style.setProperty('--website-theme-secondary', theme.colors.secondary || theme.colors.primary)
  root.style.setProperty('--website-theme-background', theme.colors.background)
  root.style.setProperty('--website-theme-text', theme.colors.text)
  root.style.setProperty('--website-theme-accent', theme.colors.accent || theme.colors.primary)
  root.style.setProperty('--website-theme-border', theme.colors.border || '#e5e7eb')
  root.style.setProperty('--website-theme-hover', theme.colors.hover || theme.colors.primary)
  root.style.setProperty('--website-theme-error', theme.colors.error || '#ef4444')
  root.style.setProperty('--website-theme-success', theme.colors.success || '#10b981')
  root.style.setProperty('--website-theme-warning', theme.colors.warning || '#f59e0b')

  // Apply font variables
  root.style.setProperty('--website-theme-font-heading', theme.fonts.heading.family)
  root.style.setProperty('--website-theme-font-heading-weight', theme.fonts.heading.weight || '700')
  root.style.setProperty('--website-theme-font-heading-size', theme.fonts.heading.size || '2rem')
  
  root.style.setProperty('--website-theme-font-body', theme.fonts.body.family)
  root.style.setProperty('--website-theme-font-body-weight', theme.fonts.body.weight || '400')
  root.style.setProperty('--website-theme-font-body-size', theme.fonts.body.size || '1rem')
  
  if (theme.fonts.accent) {
    root.style.setProperty('--website-theme-font-accent', theme.fonts.accent.family)
    root.style.setProperty('--website-theme-font-accent-weight', theme.fonts.accent.weight || '600')
    root.style.setProperty('--website-theme-font-accent-size', theme.fonts.accent.size || '1.125rem')
  }

  // Generate lighter and darker variants for primary color
  const primaryRGB = hexToRGB(theme.colors.primary)
  if (primaryRGB) {
    root.style.setProperty('--website-theme-primary-50', `rgb(${lighten(primaryRGB, 0.9)})`)
    root.style.setProperty('--website-theme-primary-100', `rgb(${lighten(primaryRGB, 0.8)})`)
    root.style.setProperty('--website-theme-primary-200', `rgb(${lighten(primaryRGB, 0.6)})`)
    root.style.setProperty('--website-theme-primary-300', `rgb(${lighten(primaryRGB, 0.4)})`)
    root.style.setProperty('--website-theme-primary-400', `rgb(${lighten(primaryRGB, 0.2)})`)
    root.style.setProperty('--website-theme-primary-500', theme.colors.primary)
    root.style.setProperty('--website-theme-primary-600', `rgb(${darken(primaryRGB, 0.1)})`)
    root.style.setProperty('--website-theme-primary-700', `rgb(${darken(primaryRGB, 0.2)})`)
    root.style.setProperty('--website-theme-primary-800', `rgb(${darken(primaryRGB, 0.3)})`)
    root.style.setProperty('--website-theme-primary-900', `rgb(${darken(primaryRGB, 0.4)})`)
  }

  // Add theme class to body for additional styling
  document.body.className = document.body.className.replace(/website-theme-\w+/g, '')
  document.body.classList.add(`website-theme-${theme._id}`)
  
  console.log('✅ Website theme applied successfully:', theme.themeName)
}

// Function to reset to default theme
function resetToDefaultTheme() {
  // Ensure we're in the browser environment
  if (typeof window === 'undefined') return
  
  console.log('🔄 Resetting to default theme')
  const root = document.documentElement
  
  // Reset to your default digitek colors
  root.style.setProperty('--website-theme-primary', '#E91E63')
  root.style.setProperty('--website-theme-secondary', '#6A1B9A')
  root.style.setProperty('--website-theme-background', '#ffffff')
  root.style.setProperty('--website-theme-text', '#000000')
  root.style.setProperty('--website-theme-accent', '#FF6D00')
  root.style.setProperty('--website-theme-border', '#e5e7eb')
  root.style.setProperty('--website-theme-hover', '#c2185b')
  root.style.setProperty('--website-theme-error', '#ef4444')
  root.style.setProperty('--website-theme-success', '#10b981')
  root.style.setProperty('--website-theme-warning', '#f59e0b')
  
  // Reset fonts to default
  root.style.setProperty('--website-theme-font-heading', 'Inter, sans-serif')
  root.style.setProperty('--website-theme-font-body', 'Inter, sans-serif')
  root.style.setProperty('--website-theme-font-accent', 'Inter, sans-serif')
  
  // Remove theme class
  document.body.className = document.body.className.replace(/website-theme-\w+/g, '')
}

// Utility functions for color manipulation
function hexToRGB(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null
}

function lighten(rgb: [number, number, number], factor: number): string {
  return rgb.map(c => Math.round(c + (255 - c) * factor)).join(', ')
}

function darken(rgb: [number, number, number], factor: number): string {
  return rgb.map(c => Math.round(c * (1 - factor))).join(', ')
}

// Component to show current theme info (for debugging)
export function WebsiteThemeDebugger() {
  const { activeTheme, isLoading, error, currentWebsiteId } = useWebsiteTheme()

  if (!currentWebsiteId) return <div className="fixed bottom-4 right-4 p-2 bg-yellow-100 rounded text-xs">No website selected</div>
  if (isLoading) return <div className="fixed bottom-4 right-4 p-2 bg-gray-100 rounded text-xs">Loading website theme...</div>
  if (error) return <div className="fixed bottom-4 right-4 p-2 bg-red-100 rounded text-xs">Website theme error: {error}</div>
  if (!activeTheme) return <div className="fixed bottom-4 right-4 p-2 bg-yellow-100 rounded text-xs">No active website theme</div>

  return (
    <div className="fixed bottom-4 right-4 p-3 bg-white shadow-lg rounded-lg text-xs max-w-xs">
      <h4 className="font-semibold mb-1">Active Website Theme</h4>
      <p><strong>Name:</strong> {activeTheme.themeName}</p>
      <p><strong>Website:</strong> {currentWebsiteId}</p>
      <p><strong>Primary:</strong> <span className="inline-block w-3 h-3 rounded ml-1" style={{ backgroundColor: activeTheme.colors.primary }}></span> {activeTheme.colors.primary}</p>
      <p><strong>Font:</strong> {activeTheme.fonts.heading.family.split(',')[0]}</p>
    </div>
  )
}