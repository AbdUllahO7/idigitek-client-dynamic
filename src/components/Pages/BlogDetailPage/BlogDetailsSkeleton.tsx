import React from "react"

export const BlogDetailsSkeleton: React.FC = () => {
  return (
    <div className="container px-4 py-32">
      <div className="max-w-3xl mx-auto">
        <div className="h-8 bg-muted/30 rounded-full w-36 mb-6 animate-pulse"></div>
        <div className="h-16 bg-muted/30 rounded-lg w-full mb-10 animate-pulse"></div>
        <div className="h-64 bg-muted/30 rounded-2xl w-full mb-10 animate-pulse"></div>
        <div className="space-y-4">
          <div className="h-6 bg-muted/30 rounded-full w-full animate-pulse"></div>
          <div className="h-6 bg-muted/30 rounded-full w-full animate-pulse"></div>
          <div className="h-6 bg-muted/30 rounded-full w-3/4 animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}