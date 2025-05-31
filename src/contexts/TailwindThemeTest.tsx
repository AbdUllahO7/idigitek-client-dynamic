"use client"
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { useWebsiteTheme } from './WebsiteThemeContext'

export function TailwindThemeTest() {
  const { activeTheme, currentWebsiteId } = useWebsiteTheme()
  const [cssVariables, setCssVariables] = useState<Record<string, string>>({})

  // Get CSS variable values from the DOM
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const root = document.documentElement
      const computedStyle = getComputedStyle(root)
      
      const variables = {
        '--website-theme-primary': computedStyle.getPropertyValue('--website-theme-primary').trim(),
        '--website-theme-secondary': computedStyle.getPropertyValue('--website-theme-secondary').trim(),
        '--website-theme-background': computedStyle.getPropertyValue('--website-theme-background').trim(),
        '--website-theme-text': computedStyle.getPropertyValue('--website-theme-text').trim(),
        '--website-theme-accent': computedStyle.getPropertyValue('--website-theme-accent').trim(),
        '--website-theme-font-heading': computedStyle.getPropertyValue('--website-theme-font-heading').trim(),
        '--website-theme-font-body': computedStyle.getPropertyValue('--website-theme-font-body').trim(),
      }
      
      setCssVariables(variables)
      console.log('🎨 Current CSS Variables:', variables)
    }
  }, [activeTheme])

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">🧪 Tailwind Theme Test</h1>
        <p className="text-muted-foreground">Testing if theme CSS variables and Tailwind classes work correctly</p>
      </div>

      {/* Current Theme Info */}
      {activeTheme && (
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📋 Current Theme Data</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium mb-2">Theme Info:</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Name:</strong> {activeTheme.themeName}</li>
                <li><strong>Website ID:</strong> {currentWebsiteId}</li>
                <li><strong>Theme ID:</strong> {activeTheme._id}</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium mb-2">Expected Colors:</h3>
              <ul className="text-sm space-y-1">
                <li><strong>Primary:</strong> {activeTheme.colors.primary}</li>
                <li><strong>Secondary:</strong> {activeTheme.colors.secondary}</li>
                <li><strong>Accent:</strong> {activeTheme.colors.accent}</li>
                <li><strong>Background:</strong> {activeTheme.colors.background}</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CSS Variables Test */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔧 CSS Variables Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(cssVariables).map(([variable, value]) => (
            <div key={variable} className="flex items-center justify-between p-3 bg-muted rounded">
              <code className="text-sm font-mono">{variable}</code>
              <div className="flex items-center gap-2">
                {variable.includes('color') || variable.includes('primary') || variable.includes('secondary') || variable.includes('accent') ? (
                  <div 
                    className="w-6 h-6 rounded border-2 border-gray-300"
                    style={{ backgroundColor: value }}
                    title={value}
                  />
                ) : null}
                <code className="text-xs bg-background px-2 py-1 rounded">
                  {value || 'Not set'}
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tailwind Classes Test */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🎨 Tailwind Classes Test</h2>
        
        {/* Primary Colors */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Primary Colors (Should be: {activeTheme?.colors.primary})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-primary text-primary-foreground p-4 rounded text-center">
              <code>bg-primary</code>
              <br />
              <small>Primary Background</small>
            </div>
            <div className="border-2 border-primary p-4 rounded text-center">
              <code>border-primary</code>
              <br />
              <small>Primary Border</small>
            </div>
            <div className="p-4 rounded text-center border">
              <span className="text-primary">
                <code>text-primary</code>
                <br />
                <small>Primary Text</small>
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Colors */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Secondary Colors (Should be: {activeTheme?.colors.secondary})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-secondary text-secondary-foreground p-4 rounded text-center">
              <code>bg-secondary</code>
              <br />
              <small>Secondary Background</small>
            </div>
            <div className="border-2 border-secondary p-4 rounded text-center">
              <code>border-secondary</code>
              <br />
              <small>Secondary Border</small>
            </div>
            <div className="p-4 rounded text-center border">
              <span className="text-secondary">
                <code>text-secondary</code>
                <br />
                <small>Secondary Text</small>
              </span>
            </div>
          </div>
        </div>

        {/* Accent Colors */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Accent Colors (Should be: {activeTheme?.colors.accent})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-accent text-accent-foreground p-4 rounded text-center">
              <code>bg-accent</code>
              <br />
              <small>Accent Background</small>
            </div>
            <div className="border-2 border-accent p-4 rounded text-center">
              <code>border-accent</code>
              <br />
              <small>Accent Border</small>
            </div>
            <div className="p-4 rounded text-center border">
              <span className="text-accent">
                <code>text-accent</code>
                <br />
                <small>Accent Text</small>
              </span>
            </div>
          </div>
        </div>

        {/* Primary Variants */}
        <div className="mb-6">
          <h3 className="font-medium mb-3">Primary Variants</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((shade) => (
              <div 
                key={shade}
                className={`bg-primary-${shade} p-3 rounded text-center text-xs`}
                style={{ 
                  color: shade >= 500 ? 'white' : 'black',
                }}
              >
                <code>bg-primary-{shade}</code>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Font Test */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">📝 Font Test</h2>
        <div className="space-y-6">
          <div className="p-4 border rounded">
            <p className="font-heading text-heading text-primary mb-2">
              Heading Font Test (font-heading text-heading)
            </p>
            <p className="text-sm text-muted-foreground">
              Should use: {activeTheme?.fonts.heading.family} • {activeTheme?.fonts.heading.weight} • {activeTheme?.fonts.heading.size}
            </p>
          </div>
          
          <div className="p-4 border rounded">
            <p className="font-body text-body mb-2">
              Body Font Test (font-body text-body)
            </p>
            <p className="text-sm text-muted-foreground">
              Should use: {activeTheme?.fonts.body.family} • {activeTheme?.fonts.body.weight} • {activeTheme?.fonts.body.size}
            </p>
          </div>
          
          <div className="p-4 border rounded">
            <p className="font-accent text-accent text-accent mb-2">
              Accent Font Test (font-accent text-accent)
            </p>
            <p className="text-sm text-muted-foreground">
              Should use: {activeTheme?.fonts.accent?.family} • {activeTheme?.fonts.accent?.weight} • {activeTheme?.fonts.accent?.size}
            </p>
          </div>
        </div>
      </div>

      {/* Button Test */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🔘 Button Test</h2>
        <div className="flex flex-wrap gap-4">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Primary Button
          </Button>
          <Button className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
            Secondary Button
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            Accent Button
          </Button>
          <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
            Outlined Primary
          </Button>
        </div>
      </div>

      {/* Gradient Test */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🌈 Gradient Test</h2>
        <div className="space-y-4">
          <div className="bg-theme-gradient p-6 rounded text-center text-white">
            <code>bg-theme-gradient</code>
            <br />
            <small>Primary → Accent → Secondary</small>
          </div>
          <div className="bg-primary-gradient p-6 rounded text-center text-white">
            <code>bg-primary-gradient</code>
            <br />
            <small>Primary → Secondary</small>
          </div>
        </div>
      </div>

      {/* Shadow Test */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">💎 Shadow Test</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded shadow-primary text-center">
            <code>shadow-primary</code>
          </div>
          <div className="bg-white p-6 rounded shadow-secondary text-center">
            <code>shadow-secondary</code>
          </div>
          <div className="bg-white p-6 rounded shadow-accent text-center">
            <code>shadow-accent</code>
          </div>
        </div>
      </div>

      {/* Real Component Example */}
      <div className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">🏗️ Real Component Example</h2>
        <div className="bg-theme-gradient p-8 rounded-lg text-center">
          <h3 className="font-heading text-heading text-white text-3xl mb-4">
            Welcome to Your Website
          </h3>
          <p className="font-body text-body text-white/90 text-lg mb-6">
            This hero section uses your custom theme colors and fonts automatically.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-accent">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Debug Info */}
      <div className="bg-muted p-4 rounded text-sm">
        <h3 className="font-medium mb-2">🔍 Debug Info:</h3>
        <ul className="space-y-1 text-xs">
          <li>✅ Theme data loaded: {activeTheme ? 'Yes' : 'No'}</li>
          <li>✅ CSS variables set: {Object.values(cssVariables).filter(v => v).length > 0 ? 'Yes' : 'No'}</li>
          <li>✅ Tailwind classes: Check visual elements above</li>
          <li>🔧 Open browser DevTools → Elements → :root to see CSS variables</li>
        </ul>
      </div>
    </div>
  )
}