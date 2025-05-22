"use client"

import { useRef } from "react"
import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"
import { blogPostsData } from "../../ConstData/ConstData"
import { BlogCarousel } from "./BlogCarousel"

export default function BlogSection() {
  const { ref, isInView } = useScrollAnimation()
  const { direction, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)
  
  const isRTL = direction === "rtl"

  // Translations for both English and Arabic
  const translations = {
    en: {
      badge: "Resources & Insights",
      heading: "Latest from Our Blog",
      subheading: "Insights, trends, and expert advice to help you get the most from your technology investments.",
      viewAllButton: "View All Articles",
    },
    ar: {
      badge: "موارد ورؤى",
      heading: "أحدث المقالات من مدونتنا",
      subheading: "رؤى واتجاهات ونصائح الخبراء لمساعدتك في تحقيق أقصى استفادة من استثماراتك التكنولوجية.",
      viewAllButton: "عرض جميع المقالات",
    }
  }

  // Get the correct content based on language
  const content = translations[language === "ar" ? "ar" : "en"]
  const blogPosts = blogPostsData[language === "ar" ? "ar" : "en"]

  return (
    <section className="relative w-full overflow-hidden py-16 md:py-24" id="blog" dir={direction}>
      {/* Modern layered background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background/90 z-0" />

      {/* Animated dot pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(120,119,198,0.1)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black,transparent)] opacity-70" />

      {/* Floating gradient orbs */}
      <div className="absolute top-20 left-[10%] w-64 h-64 md:w-96 md:h-96 lg:w-[35rem] lg:h-[35rem] bg-gradient-to-r from-violet-500/10 to-indigo-500/10 rounded-full blur-3xl md:blur-[8rem] -z-10" />
      <div className="absolute bottom-40 right-[5%] w-48 h-48 md:w-72 md:h-72 lg:w-[25rem] lg:h-[25rem] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl md:blur-[7rem] -z-10" />

      <div className="container relative px-4 md:px-6 mx-auto z-10" ref={containerRef}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6 },
            },
          }}
          className="flex flex-col items-center justify-center space-y-6 md:space-y-8 text-center mb-12 md:mb-20"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-medium text-primary backdrop-blur-sm shadow-sm"
          >
            <BookOpen className="h-3 w-3 md:h-4 md:w-4" />
            <span>{content.badge}</span>
          </motion.div>

          <div className="space-y-3 md:space-y-5 max-w-4xl">
            <motion.h2
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight"
            >
              <span className="inline bg-clip-text text-black dark:text-white dark:from-violet-400 dark:via-indigo-400 dark:to-purple-400">
                {content.heading}
              </span>
            </motion.h2>

            <motion.p
              initial={{ y: 40, opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
              className="text-base md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto"
            >
              {content.subheading}
            </motion.p>
          </div>
        </motion.div>

        {/* Blog Posts Carousel */}
        <div className="mt-8 md:mt-12">
          <BlogCarousel 
            posts={blogPosts} 
            isInView={isInView} 
            containerRef={containerRef} 
            isRTL={isRTL} 
          />
        </div>
      </div>
    </section>
  )
}
