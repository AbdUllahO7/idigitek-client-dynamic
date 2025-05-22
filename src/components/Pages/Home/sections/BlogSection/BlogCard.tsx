// src/components/Blog/BlogCard.tsx
"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Clock } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { ButtonSectionLink } from "@/components/SectionLinks"
import { Post } from "./types"

interface BlogCardProps {
  post: Post
  index: number
  isInView: boolean
  isRTL: boolean
}

export function BlogCard({ post, index, isInView, isRTL }: BlogCardProps) {
  const { direction } = useLanguage()

  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            duration: 0.6,
            delay: 0.2 + index * 0.1, // Reduced delay for better UX
          },
        },
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group flex flex-col h-full rounded-2xl border border-border/40 bg-background/80 backdrop-blur-sm shadow-lg shadow-indigo-500/5 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <div className="relative overflow-hidden">
        <div className={`absolute top-3 md:top-4 ${isRTL ? "right-3 md:right-4" : "left-3 md:left-4"} z-10`}>
          <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 text-xs font-medium rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white backdrop-blur-sm shadow-sm">
            {post.category}
          </span>
        </div>
        <div className="transition-transform duration-500 group-hover:scale-105">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            width={400}
            height={200}
            className="w-full h-40 sm:h-48 md:h-56 object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 md:p-5 lg:p-7">
        <div className="space-y-3 md:space-y-4">
          <div className="flex items-center justify-between text-xs md:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-violet-600 to-indigo-600 p-[2px] overflow-hidden shadow-sm">
                <div className="w-full h-full rounded-full bg-background overflow-hidden">
                  <Image
                    src={`https://api.dicebear.com/7.x/micah/svg?seed=${post.author}`}
                    alt={post.author}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
              </div>
              <span className="text-xs md:text-sm truncate max-w-24 md:max-w-32">{post.author}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Clock className="w-3 h-3 md:w-3.5 md:h-3.5" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <h3 className={`font-bold text-base md:text-lg lg:text-xl leading-tight group-hover:text-primary transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}>
            {post.title}
          </h3>

          <p className={`text-xs md:text-sm text-muted-foreground line-clamp-2 ${isRTL ? "text-right" : "text-left"}`}>
            {post.excerpt}
          </p>

          <div className={`flex items-center justify-between pt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="text-xs text-muted-foreground">{post.date}</span>
            <ButtonSectionLink 
              href={`/Pages/BlogDetailPage/${post.id}`} 
              className="group text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 bg-neutral-900 text-neutral-50 bg-gradient-to-tr from-digitek-pink to-digitek-purple shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-white dark:hover:bg-neutral-50/90"
            >
              {direction === "ltr" ? "Read more" : "اقرأ المزيد"}
              <ArrowRight className={`${isRTL ? 'mr-1 md:mr-2 rotate-180' : 'ml-1 md:ml-2'} h-3 w-3 md:h-4 md:w-4 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
            </ButtonSectionLink>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
