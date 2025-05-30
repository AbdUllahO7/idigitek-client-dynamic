"use client"

import type React from "react"
import { useRef } from "react"
import Image from "next/image"
import { motion, useInView } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

export default function TeamSection({websiteId , sectionId}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.2 })
  const { t,  language } = useLanguage()

  const { content, isLoading: sectionLoading, error: sectionError, refetch, direction, formatDate } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "team",
  })

  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
    sectionId,
    websiteId,
    fieldMappings: {
      id: "_id",
      title: "Title",
      logo:"Logo",
      excerpt: "Description",
      job: "Job",
      date: "createdAt",
      color: () => "from-digitek-orange to-digitek-pink"
    }
  })


  // Function to get current language text
  const getCurrentText = (member: any, field: 'name' | 'role' | 'bio') => {
    return language === 'ar' ? member[`${field}Ar`] : member[`${field}En`]
  }

  return (
    <section id="team" className="relative w-full py-20 overflow-hidden" dir={direction}>
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background"></div>

      <div className="absolute top-0 left-0 w-full h-40 bg-grid-pattern opacity-5"></div>
      <div className="absolute bottom-0 right-0 w-full h-40 bg-grid-pattern opacity-5"></div>

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

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
  {contentItems.map((member, index) => (
    <TeamMemberCard 
      key={index} 
      member={{
        nameEn: member.title, // Map title to nameEn
        nameAr: member.titleAr || member.title, // Fallback to title if no titleAr
        roleEn: member.job, // Map job to roleEn
        roleAr: member.jobAr || member.job, // Fallback to job if no jobAr
        bioEn: member.excerpt, // Map excerpt to bioEn
        bioAr: member.excerptAr || member.excerpt, // Fallback to excerpt if no excerptAr
        logo: member.logo || "https://cdn-icons-png.flaticon.com/256/4847/4847064.png", // Ensure image is present
       
        color: member.color,
      }} 
      index={index} 
      isInView={isInView} 
      getCurrentText={getCurrentText}
    />
  ))}
</div>

      </div>
    </section>
  )
}

interface TeamMemberCardProps {
  member: {
    nameEn: string
    nameAr: string
    roleEn: string
    roleAr: string
    bioEn: string
    bioAr: string
    logo: string
    color: string
  }
  index: number
  isInView: boolean
  getCurrentText: (member: any, field: 'name' | 'role' | 'bio') => string
}

function TeamMemberCard({ 
  member, 
  index, 
  isInView, 
  getCurrentText 
}: TeamMemberCardProps) {
  const cardRef = useRef(null)
  const cardInView = useInView(cardRef, { once: false, amount: 0.3 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50 }}
      animate={cardInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl bg-background border border-border/50 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${member.color}`}></div>

      <div className="p-6">
        <div className="flex flex-col items-center text-center">
          {/* Image with gradient border */}
          <div className="relative mb-6">
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-r ${member.color} blur-sm opacity-70 scale-110`}
            ></div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className={`relative overflow-hidden rounded-full border-2 border-white h-28 w-28 bg-gradient-to-r ${member.color} p-0.5`}
            >
              <div className="rounded-full overflow-hidden h-full w-full bg-background">
                <Image
                  src={member.logo || "/placeholder.svg"}
                  alt={getCurrentText(member, 'name')}
                  width={128}
                  height={128}
                  className="h-full w-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors duration-300">
            {getCurrentText(member, 'name')}
          </h3>

          <p className={`text-sm font-medium bg-clip-text text-transparent bg-gradient-to-r ${member.color} mb-3`}>
            {getCurrentText(member, 'role')}
          </p>

          <p className="text-sm text-muted-foreground mb-5">
            {getCurrentText(member, 'bio')}
          </p>

         
        </div>
      </div>

      {/* Corner accent */}
      <div
        className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${member.color} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
      ></div>
    </motion.div>
  )
}
