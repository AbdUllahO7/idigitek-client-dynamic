"use client"

import { useRef } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { ProcessSteps } from "../ConstData/ConstData"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function ProcessSection({websiteId , sectionId}) {
  const { t,  language } = useLanguage()
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 })
  

    const { content, isLoading: sectionLoading, error: sectionError, refetch, direction, formatDate } = useSectionLogic({
      sectionId,
      websiteId,
      itemsKey: "process",
    })


      const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
        sectionId,
        websiteId,
        fieldMappings: {
          id: "_id",
          image: "Background Image",
          title: "Title",
          excerpt: "Description",
          date: "createdAt",
          color: () => "from-digitek-orange to-digitek-pink"
        }
      })
    

    console.log("ProcessSection contentItems:", contentItems)
  

  // Parallax effect for background elements
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const yBgShape1 = useTransform(scrollYProgress, [0, 1], [0, -100])
  const yBgShape2 = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacityBg = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])


  // Function to get current language text
  const getCurrentText = (step: any, field: 'title' | 'description') => {
    return language === 'ar' ? step[`${field}Ar`] : step[`${field}En`]
  }

  return (
    <section 
      className="relative w-full py-20 overflow-hidden" 
      ref={sectionRef}
      dir={direction}
    >
      {/* Background elements */}
      <div className="absolute inset-0" />
      
      {/* Animated grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center opacity-5" />
      
      {/* Background decorative shapes */}
      <motion.div 
        style={{ y: yBgShape1, opacity: opacityBg }}
        className="absolute right-0 top-20 w-96 h-96 rounded-full bg-digitek-purple/10 blur-3xl"
      />
      <motion.div 
        style={{ y: yBgShape2, opacity: opacityBg }}
        className="absolute -left-20 bottom-40 w-80 h-80 rounded-full bg-digitek-pink/10 blur-3xl"
      />

      <div className="container relative z-10 px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto"
        >
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-digitek-pink mb-2">
            {content.sectionLabel}
            <span className="ml-2 inline-block w-1.5 h-1.5 rounded-full bg-digitek-pink animate-pulse"></span>
          </span>
          <h2 className="text-4xl font-bold text-black dark:text-white md:text-5xl lg:text-6xl bg-clip-text">
            {content.sectionTitle}
          </h2>
          <p className="text-lg text-black dark:text-white md:text-xl">
            {content.sectionDescription}
          </p>
        </motion.div>

        <div className="mt-24 space-y-32 lg:space-y-0 lg:grid lg:grid-cols-1 lg:gap-16 xl:gap-24">
                  <div className="mt-24 space-y-32 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-16 xl:gap-24">
            {contentItems.map((item, index) => (
              <ProcessStep 
                key={item.id} 
                step={{
                  number: `${index + 1}`, // Generate step number (e.g., 1, 2, 3)
                  titleEn: item.title, // Assuming title is in English
                  titleAr: item.titleAr || item.title, // Fallback to English if no Arabic title
                  descriptionEn: item.excerpt, // Map excerpt to description
                  descriptionAr: item.excerptAr || item.excerpt, // Fallback to English if no Arabic description
                  color: item.color,
                  image: item.image,
                  accent: item.accent || (index % 3 === 0 ? "pink" : index % 3 === 1 ? "purple" : "orange") // Fallback accent colors
                }} 
                index={index} 
                isInView={isInView} 
                isLast={index === contentItems.length - 1}
                getCurrentText={getCurrentText}
              />
            ))}
          </div>
        </div>

        {/* Connection lines for desktop - visible only on lg+ screens */}
        <div className="hidden lg:block absolute top-0 left-0 right-0 h-full pointer-events-none">
          <svg className="absolute top-[28%] left-0 w-full h-[60%]" width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Main zigzag path */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
              d="M0,20 L50,0 L50,33 L100,20 M0,80 L50,60 L50,100 L100,80"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="0.5"
              strokeDasharray="1,3"
              className="opacity-40"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#E91E63" />
                <stop offset="33%" stopColor="#6A1B9A" />
                <stop offset="66%" stopColor="#E91E63" />
                <stop offset="100%" stopColor="#FF6D00" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </section>
  )
}

interface ProcessStepProps {
  step: {
    number: string
    titleEn: string
    titleAr: string
    descriptionEn: string
    descriptionAr: string
    color: string
    image: string
    accent: string
  }
  index: number
  isInView: boolean
  isLast: boolean
  getCurrentText: (step: any, field: 'title' | 'description') => string
}

function ProcessStep({ 
  step, 
  index, 
  isInView, 
  isLast, 
  getCurrentText 
}: ProcessStepProps) {
  const stepRef = useRef(null)
  const isStepInView = useInView(stepRef, { once: false, amount: 0.3 })
  const { direction } = useLanguage()
  const isOdd = index % 2 === 1
  
  // Different animations based on screen size
  const mobileVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        delay: index * 0.2 
      } 
    }
  }
  
  const desktopVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.6,
        delay: 0.3 + index * 0.2 
      } 
    }
  }

  // Set the accent color
  let accentColor = "bg-digitek-pink"
  let ringColor = "ring-digitek-pink/20"
  let textColor = "text-digitek-pink"
  
  if (step.accent === "purple") {
    accentColor = "bg-digitek-purple"
    ringColor = "ring-digitek-purple/20"
    textColor = "text-digitek-purple"
  } else if (step.accent === "orange") {
    accentColor = "bg-digitek-orange"
    ringColor = "ring-digitek-orange/20"
    textColor = "text-digitek-orange"
  }

  return (
    <motion.div
      ref={stepRef}
      className={`relative lg:flex lg:flex-col lg:h-full lg:justify-center ${isOdd ? 'lg:mt-64' : ''}`}
      initial="hidden"
      animate={isStepInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {/* Number indicator */}
      <motion.div
        variants={mobileVariants}
        className={`z-20 flex items-center justify-center w-16 h-16 rounded-full ${accentColor} text-white text-xl font-bold ring-8 ${ringColor} lg:absolute lg:-top-8 lg:left-1/2 lg:-translate-x-1/2 shadow-lg mb-6 mx-auto lg:mb-0`}
      >
        {step.number}
      </motion.div>
      
      {/* Content Card */}
      <motion.div
        variants={desktopVariants}
        whileHover={{ 
          y: -5, 
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          transition: { duration: 0.3 }
        }}
        className="relative z-10 backdrop-blur-sm rounded-2xl border overflow-hidden shadow-xl"
      >
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <div className={`absolute inset-0 ${accentColor} mix-blend-multiply opacity-20`}></div>
          <Image
            src={step.image}
            alt={getCurrentText(step, 'title')}
            width={600}
            height={400}
            className="object-cover w-full h-full"
          />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-800 to-transparent opacity-60"></div>
          <div className={`absolute bottom-0 left-0 w-full h-1 ${accentColor}`}></div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          <h3 className={`text-2xl font-bold mb-3 ${textColor}`}>
            {getCurrentText(step, 'title')}
          </h3>
          <p className="text-muted-foreground">
            {getCurrentText(step, 'description')}
          </p>
          
          {/* Feature dots - purely decorative */}
          <div className="flex space-x-1 mt-6">
            <div className={`h-1.5 w-1.5 rounded-full ${accentColor}`}></div>
            <div className={`h-1.5 w-1.5 rounded-full bg-slate-600`}></div>
            <div className={`h-1.5 w-1.5 rounded-full bg-slate-600`}></div>
          </div>
        </div>
      </motion.div>
      
      {/* Connecting line for mobile */}
      {!isLast && (
        <motion.div
          initial={{ height: 0 }}
          animate={isStepInView ? { height: 60 } : { height: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`absolute -bottom-16 left-1/2 w-0.5 ${accentColor} -translate-x-1/2 lg:hidden`}
        />
      )}
    </motion.div>
  )
} 