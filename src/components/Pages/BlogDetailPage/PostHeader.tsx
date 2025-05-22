import React from "react"
import Image from "next/image"
import { Clock, Calendar } from "lucide-react"
import { motion } from "framer-motion"

interface PostHeaderProps {
  post: {
    category: string
    title: string
    author: string
    date: string
    readTime: string
  }
  content: {
    publishedOn: string
  }
  isRTL: boolean
}

export const PostHeader: React.FC<PostHeaderProps> = ({ post, content, isRTL }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mb-8"
    >
      <div className={`flex items-center gap-3 mb-2 ${isRTL ? "justify-end" : ""}`}>
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-sm">
          {post.category}
        </span>
      </div>
      
      <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6 ${isRTL ? "text-right" : ""}`}>
        {post.title}
      </h1>
      
      <div className={`flex flex-wrap items-center gap-5 text-sm text-muted-foreground ${isRTL ? "justify-end" : ""}`}>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>{content.publishedOn} {post.date}</span>
        </div>
        
      </div>
    </motion.div>
  )
}