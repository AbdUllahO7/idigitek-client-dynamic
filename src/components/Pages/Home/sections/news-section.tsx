"use client"

import { useRef, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, useAnimation, AnimatePresence } from "framer-motion"
import { ArrowRight, Calendar, ChevronLeft, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { ButtonSectionLink } from "@/components/SectionLinks"
import { translationsNews } from "../ConstData/ConstData"

export default function NewsSection() {
  const ref = useRef(null)
  const carouselRef = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { language, direction } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const controls = useAnimation()

  // Get current language content
  const content = translationsNews[language] || translationsNews["en"]

  // Reset active index when language changes
  useEffect(() => {
    setActiveIndex(0)
  }, [language])

  // Auto-play carousel
  useEffect(() => {
    let interval

    if (isAutoPlaying) {
      interval = setInterval(() => {
        nextNews()
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoPlaying, activeIndex])

  // Pause auto-play on hover
  const handleMouseEnter = () => setIsAutoPlaying(false)
  const handleMouseLeave = () => setIsAutoPlaying(true)

  // Function to format date based on language
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")
  }

  const nextNews = () => {
    setActiveIndex((prev) => (prev === content.news.length - 1 ? 0 : prev + 1))
  }

  const prevNews = () => {
    setActiveIndex((prev) => (prev === 0 ? content.news.length - 1 : prev - 1))
  }

  // Get the previous, current, and next items for the infinite carousel
  const getVisibleItems = () => {
    const items = content.news
    if (items.length <= 3) return items

    // For desktop view, show 3 items
    const prevIndex = activeIndex === 0 ? items.length - 1 : activeIndex - 1
    const nextIndex = activeIndex === items.length - 1 ? 0 : activeIndex + 1

    return [items[prevIndex], items[activeIndex], items[nextIndex]]
  }

  return (
    <section id="news" className="relative w-full py-20 overflow-hidden" dir={direction}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background"></div>

      <div className="absolute top-0 left-0 w-full h-40 bg-grid-pattern opacity-5 transform rotate-3"></div>
      <div className="absolute bottom-0 right-0 w-full h-40 bg-grid-pattern opacity-5 transform -rotate-3"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/3 left-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full bg-digitek-pink blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {content.sectionLabel}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl"
          >
            {content.sectionTitle}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-muted-foreground text-lg"
          >
            {content.sectionDescription}
          </motion.p>
        </div>

        {content.news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">{content.error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              {content.retry}
            </Button>
          </div>
        ) : (
          <>
            {/* Desktop view: Infinite Carousel */}
            <div
              ref={carouselRef}
              className="hidden md:block relative overflow-hidden"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <div className="relative">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`desktop-${activeIndex}`}
                    className="grid grid-cols-3 gap-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {getVisibleItems().map((news, index) => (
                      <NewsCard
                        key={`${news.id}-${index}`}
                        news={news}
                        index={index}
                        isInView={isInView}
                        direction={direction}
                        formatDate={formatDate}
                        readMoreText={content.readMore}
                      />
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
                  onClick={direction === "rtl" ? nextNews : prevNews}
                >
                  <ChevronLeft className="h-5 w-5" />
                  <span className="sr-only">{content.previousNews}</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
                  onClick={direction === "rtl" ? prevNews : nextNews}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">{content.nextNews}</span>
                </Button>
              </div>
            </div>

            {/* Mobile view: Carousel */}
            <div className="md:hidden relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <div className="overflow-hidden rounded-2xl">
                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`mobile-${activeIndex}`}
                    initial={{ opacity: 0, x: direction === "rtl" ? -100 : 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction === "rtl" ? 100 : -100 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="w-full"
                  >
                    <NewsCard
                      news={content.news[activeIndex]}
                      index={0}
                      isInView={true}
                      direction={direction}
                      formatDate={formatDate}
                      readMoreText={content.readMore}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation controls */}
              <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between items-center px-4 z-20">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
                  onClick={direction === "rtl" ? nextNews : prevNews}
                >
                  {direction === "rtl" ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  <span className="sr-only">{content.previousNews}</span>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
                  onClick={direction === "rtl" ? prevNews : nextNews}
                >
                  <ChevronRight className="h-5 w-5" />
                  <span className="sr-only">{content.nextNews}</span>
                </Button>
              </div>

            
            </div>
          </>
        )}

        
      </div>
    </section>
  )
}

function NewsCard({ news, index, isInView, direction, formatDate, readMoreText }) {
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, { once: false, amount: 0.3 })
  const isRTL = direction === "rtl"

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateY: 15 }}
      animate={
        cardInView
          ? {
              opacity: 1,
              y: 0,
              rotateY: 0,
              transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1 * index,
              },
            }
          : { opacity: 0, y: 50, rotateY: 15 }
      }
      whileHover={{
        y: -10,
        transition: { type: "spring", stiffness: 400, damping: 10 },
      }}
      className="group relative overflow-hidden rounded-2xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col"
    >
      {/* Top gradient bar with animation */}
      <motion.div
        className={`h-1.5 w-full bg-gradient-to-r ${news.color}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
      ></motion.div>

      <div className="relative overflow-hidden aspect-video">
        <motion.div initial={{ scale: 1.2 }} animate={{ scale: 1 }} transition={{ duration: 0.8, delay: 0.1 * index }}>
          <Image
            src={news.image || "/placeholder.svg"}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </motion.div>
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
        >
          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white bg-gradient-to-r ${news.color}`}>
            {news.category}
          </span>
        </motion.div>
      </div>

      <CardContent className="flex-grow p-6">
        <motion.div
          className="flex items-center text-sm text-muted-foreground mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
        >
          <Calendar className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
          {formatDate(news.date)}
        </motion.div>

        <motion.h3
          className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
        >
          {news.title}
        </motion.h3>

        <motion.p
          className="text-muted-foreground line-clamp-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
        >
          {news.excerpt}
        </motion.p>
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
        >
          <Link
            href={`/Pages/NewsDetailPage/${news.id}`}
            className="inline-flex items-center text-primary font-medium hover:underline"
          >
            {readMoreText}
            <ArrowRight
              className={`${isRTL ? "mr-2 rotate-180" : "ml-2"} h-4 w-4 transition-transform duration-300 ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
            />
          </Link>
        </motion.div>
      </CardFooter>

      {/* Corner accent with animation */}
      <motion.div
        className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${news.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, delay: 0.3 + index * 0.1 }}
      ></motion.div>
    </motion.div>
  )
}

