
// src/components/Pages/Testimonials/TestimonialsList.jsx
"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TestimonialCard } from "./TestimonialCard"

export const TestimonialsList = ({ 
  loading, 
  error, 
  filteredTestimonials, 
  t, 
  direction, 
  resetFilters 
}) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold mb-4 text-red-500">{t.error}</h3>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (filteredTestimonials.length > 0) {
    return (
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredTestimonials.map((testimonial, index) => (
          <TestimonialCard 
            key={testimonial.id} 
            testimonial={testimonial} 
            index={index} 
            direction={direction}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="text-center py-20">
      <h3 className="text-2xl font-semibold mb-4">{t.noTestimonialsFound}</h3>
      <p className="text-muted-foreground mb-8">
        {t.adjustFilters}
      </p>
      <Button variant="outline" onClick={resetFilters}>
        {t.resetFilters}
      </Button>
    </div>
  )
}
