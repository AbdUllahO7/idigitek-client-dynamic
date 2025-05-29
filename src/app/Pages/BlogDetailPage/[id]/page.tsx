"use client"

import React, { use, useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { blogPostsData } from "@/components/Pages/Home/ConstData/ConstData"
import { useTranslationsBlogDetail } from "@/components/Pages/BlogDetailPage/useTranslationsBlogDetail"
import { PostNotFound } from "@/components/Pages/BlogDetailPage/PostNotFound"
import { BlogDetailsSkeleton } from "@/components/Pages/BlogDetailPage/BlogDetailsSkeleton"
import { GoBackButton } from "@/components/GoBackButton"
import { PostHeader } from "@/components/Pages/BlogDetailPage/PostHeader"
import { FeaturedImage } from "@/components/Pages/BlogDetailPage/FeaturedImage"
import { PostContent } from "@/components/Pages/BlogDetailPage/PostContent"
import { RelatedPosts } from "@/components/Pages/BlogDetailPage/RelatedPosts"
import { useSubSections } from "@/lib/subSections/use-subSections"
import { ProjectNotFound } from "@/components/Pages/ProjectsDetailPage/data/ProjectNotFound"
import { SectionSkeleton } from "@/components/Skeleton/SectionSkeleton"



export default function BlogDetails({ params }: { params: Promise<{ id: string }> }) {
    const { direction } = useLanguage()  
    const resolvedParams = use(params)
    const projectId = resolvedParams.id
    const { useGetBySectionItemIds, useGetCompleteById } = useSubSections()
    const { data: blogData, error: blogError } = useGetCompleteById(projectId)
    const { data: sectionData, error: sectionError } = useGetBySectionItemIds([blogData?.data?.sectionItem?._id])

    // Handle errors or loading states
    if (blogError || sectionError) {
      console.error("Errors:", blogError, sectionError)
      return <ProjectNotFound />
    }
    if (!blogData || !sectionData) {
      return <SectionSkeleton variant="default" className="py-20"/>
    }


  return (
    <div className="relative w-full py-16 md:py-24 overflow-hidden" dir={direction}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(120,119,198,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] opacity-70" />

      <div className="container relative px-4 md:px-6 z-10">
        <div className="max-w-3xl mx-auto">
          <PostHeader blog={blogData.data}/>
          <FeaturedImage blog={blogData.data} />
          <PostContent blog={blogData.data} />
               {/* <RelatedPosts 
            relatedPosts={relatedPosts} 
            content={content} 
            blogPosts={blogPosts} 
            isRTL={isRTL} 
          /> */}
        </div>
      </div>
    </div>
  )
}