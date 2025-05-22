import React from "react"
import { Button } from "@/components/ui/button"
import { GoBackButton } from "@/components/GoBackButton"
import { useLanguage } from "@/contexts/language-context"

interface PostNotFoundProps {
  content: {
    notFound: string
  }
}

export const PostNotFound: React.FC<PostNotFoundProps> = ({ content }) => {
  const { direction } = useLanguage()
  
  return (
    <div className="container px-4 py-32 text-center" dir={direction}>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">{content.notFound}</h1>
        <Button
          asChild
          variant="default"
          className="rounded-full"
        >
          <GoBackButton sectionName="blog" />
        </Button>
      </div>
    </div>
  )
}