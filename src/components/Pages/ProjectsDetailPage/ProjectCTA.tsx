import React from "react"
import { Button } from "@/components/ui/button"

export const ProjectCTA: React.FC = () => {
  return (
    <section className="bg-muted py-16">
      <div className="container px-4 md:px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Own Project?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
          Let's discuss how Idigitek Solutions can help transform your business with our innovative technology
          solutions.
        </p>
        <Button className="bg-gradient-to-tr from-digitek-pink to-digitek-purple text-white">
          Contact Us Today
        </Button>
      </div>
    </section>
  )
}