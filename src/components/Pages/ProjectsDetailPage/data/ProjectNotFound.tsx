import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export const ProjectNotFound: React.FC = () => {
  return (
    <div className="container px-4 md:px-6 py-20 text-center">
      <h1 className="text-3xl font-bold mb-6">Project Not Found</h1>
      <p className="text-muted-foreground mb-8">
        The project you're looking for doesn't exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/Pages/ProjectsPage">Back to Projects</Link>
      </Button>
    </div>
  )
}