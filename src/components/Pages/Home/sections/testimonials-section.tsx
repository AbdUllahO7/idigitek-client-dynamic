"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ButtonSectionLink } from "@/components/SectionLinks"
import { testimonials } from "../ConstData/ConstData"

export default function TestimonialsSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { t, direction, language } = useLanguage()
  const [activeIndex, setActiveIndex] = useState(0)

  // Section translations
  const sectionTranslations = {
    en: {
      badge: "Testimonials",
      title: "What Our Clients Say",
      description: "Hear directly from businesses that have partnered with us to modernize their operations and elevate their customer experience."
    },
    ar: {
      badge: "الشهادات",
      title: "ماذا يقول عملاؤنا",
      description: "اسمع مباشرة من الشركات التي تعاونت معنا لتحديث عملياتها والارتقاء بتجربة العملاء."
    }
  }

  // Get the right section text based on language
  const sectionText = sectionTranslations[language] || sectionTranslations.en

  // Function to get current language text
  const getCurrentText = (testimonial: any, field: 'quote' | 'author' | 'role') => {
    return language === 'ar' ? testimonial[`${field}Ar`] : testimonial[`${field}En`]
  }

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))
  }

  const prevTestimonial = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))
  }

  return (
    <section className="relative w-full py-20 overflow-hidden" id="testimonials" dir={direction}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background"></div>

      <div className="absolute top-0 right-0 w-full h-40 bg-grid-pattern opacity-5 transform -rotate-3"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-grid-pattern opacity-5 transform rotate-3"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/3 right-0 w-96 h-96 rounded-full bg-digitek-pink blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/3 left-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div ref={ref} className="flex flex-col items-center justify-center space-y-6 text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            {sectionText.badge}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight max-w-3xl"
          >
            {sectionText.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-muted-foreground text-lg"
          >
            {sectionText.description}
          </motion.p>
        </div>

        {/* Desktop view: Grid layout */}
        <div className="hidden md:grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard 
              key={index} 
              testimonial={testimonial} 
              index={index} 
              isInView={isInView} 
              getCurrentText={getCurrentText}
            />
          ))}
        </div>

        {/* Mobile view: Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: direction === 'ltr' ? 100 : -100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction === 'ltr' ? -100 : 100 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="w-full"
              >
                <TestimonialCard 
                  testimonial={testimonials[activeIndex]} 
                  index={0} 
                  isInView={true} 
                  getCurrentText={getCurrentText}
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
              onClick={direction === 'ltr' ? prevTestimonial : nextTestimonial}
            >
              {direction === 'ltr' ? (
                <ChevronLeft className="h-5 w-5" />
              ) : (
                <ChevronRight className="h-5 w-5 transform scale-x-[-1]" />
              )}
              <span className="sr-only">{t("testimonials.previousTestimonial")}</span>
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-background/80 backdrop-blur-sm border-2 shadow-lg hover:bg-background"
              onClick={direction === 'ltr' ? nextTestimonial : prevTestimonial}
            >
              {direction === 'ltr' ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5 transform scale-x-[-1]" />
              )}
              <span className="sr-only">{t("testimonials.nextTestimonial")}</span>
            </Button>
          </div>

          {/* Dots navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  activeIndex === index ? "bg-primary w-8" : "bg-primary/30 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 text-center"
        >
          <ButtonSectionLink 
            href={`/Pages/TestimonialPage`} 
            className="group bg-neutral-900 text-neutral-50 bg-gradient-to-tr from-digitek-pink to-digitek-purple shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-white dark:hover:bg-neutral-50/90"
          >
            {direction  === 'ltr' ? 'Read More' : 'اقرأ المزيد'}
            {direction === 'ltr' ? (
              <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            ) : (
              <ArrowRight className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1 transform scale-x-[-1]" />
            )}
          </ButtonSectionLink>
        </motion.div>
      </div>
    </section>
  )
}

interface TestimonialCardProps {
  testimonial: {
    quoteEn: string
    quoteAr: string
    authorEn: string
    authorAr: string
    roleEn: string
    roleAr: string
    image: string
    color: string
  }
  index: number
  isInView: boolean
  getCurrentText: (testimonial: any, field: 'quote' | 'author' | 'role') => string
}

function TestimonialCard({ 
  testimonial, 
  index, 
  isInView, 
  getCurrentText 
}: TestimonialCardProps) {
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, { once: false, amount: 0.3 })
  const { direction } = useLanguage()

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-background border border-border/50 shadow-lg hover:shadow-xl transition-all duration-500 h-full flex flex-col"
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${testimonial.color}`}></div>

      <div className="p-6 md:p-8 flex flex-col h-full">
        {/* Quote icon */}
        <div
          className={`w-12 h-12 mb-6 rounded-full bg-gradient-to-r ${testimonial.color} flex items-center justify-center text-white`}
        >
          <Quote className="h-6 w-6" />
        </div>

        <p className={`italic text-muted-foreground mb-8 flex-grow ${direction === 'rtl' ? 'text-right' : ''}`}>
          "{getCurrentText(testimonial, 'quote')}"
        </p>

        <div className="mt-auto pt-6 border-t border-border/50 flex items-center">
          <div className={`relative ${direction === 'ltr' ? 'mr-4' : 'ml-4'}`}>
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${testimonial.color} blur-sm opacity-70 scale-110`}
            ></div>
            <div
              className={`relative overflow-hidden rounded-full border-2 border-white h-12 w-12 bg-gradient-to-r ${testimonial.color} p-0.5`}
            >
              <div className="rounded-full overflow-hidden h-full w-full bg-background">
                <Image
                  src={testimonial.image || "/placeholder.svg"}
                  alt={getCurrentText(testimonial, 'author')}
                  width={48}
                  height={48}
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className={direction === 'rtl' ? 'text-right' : ''}>
            <h4 className="font-semibold group-hover:text-primary transition-colors duration-300">
              {getCurrentText(testimonial, 'author')}
            </h4>
            <p className={`text-sm bg-clip-text text-transparent bg-gradient-to-r ${testimonial.color}`}>
              {getCurrentText(testimonial, 'role')}
            </p>
          </div>
        </div>
      </div>

      {/* Corner accent */}
      <div
        className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${testimonial.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
      ></div>
    </motion.div>
  )
}