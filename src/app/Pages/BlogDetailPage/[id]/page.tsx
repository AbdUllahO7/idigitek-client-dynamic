"use client"

import React, { useEffect, useState } from "react"
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



export default function BlogDetails() {
  const params = useParams()
  const { direction, language } = useLanguage()
  const isRTL = direction === "rtl"
  
  const content = useTranslationsBlogDetail()
  const blogPosts = blogPostsData[language === "ar" ? "ar" : "en"]
  
  // Find the blog post based on URL id parameter
  const [post, setPost] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (params?.id) {
      // Handle both numeric IDs and title-based IDs
      const id = Array.isArray(params.id) ? params.id[0] : params.id
      
      // Try to find the post by numeric ID first
      let foundPost = null;
      const postIndex = parseInt(id);
      
      if (!isNaN(postIndex) && postIndex > 0 && postIndex <= blogPosts.length) {
        // If it's a valid numeric ID
        foundPost = blogPosts[postIndex - 1];
      } else {
        // If not a numeric ID, try to find by title (URL might be slugified)
        const normalizedId = id.toLowerCase().replace(/-/g, ' ');
        foundPost = blogPosts.find(post => 
          post.title.toLowerCase() === normalizedId || 
          post.title.toLowerCase().replace(/-/g, ' ') === normalizedId
        );
      }
      
      setPost(foundPost || null);
      
      // Find related posts (same category)
      if (foundPost) {
        const related = blogPosts
          .filter(p => p.category === foundPost.category && p !== foundPost)
          .slice(0, 3);
        setRelatedPosts(related);
      }
      
      setLoading(false);
    }
  }, [params, blogPosts])

  // If post is not found
  if (!loading && !post) {
    return <PostNotFound content={content} />
  }

  // Show loading skeleton
  if (loading || !post) {
    return <BlogDetailsSkeleton />
  }

  return (
    <div className="relative w-full py-16 md:py-24 overflow-hidden" dir={direction}>
      {/* Background patterns */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(120,119,198,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] opacity-70" />

      <div className="container relative px-4 md:px-6 z-10">
        <div className="max-w-3xl mx-auto">
          <GoBackButton sectionName="blog" />
          <PostHeader post={post} content={content} isRTL={isRTL} />
          <FeaturedImage post={post} />
          <PostContent post={post} isRTL={isRTL} />
          <RelatedPosts 
            relatedPosts={relatedPosts} 
            content={content} 
            blogPosts={blogPosts} 
            isRTL={isRTL} 
          />
        </div>
      </div>
    </div>
  )
}