"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
  isInView: boolean
  sectionTitle: string
  mainTitle: string
  mainDescription: string
  centered?: boolean
}

export default function SectionHeader({ 
  isInView, 
  sectionTitle, 
  mainTitle, 
  mainDescription,
  centered = true
}: SectionHeaderProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium ${centered ? 'mx-auto' : 'w-fit'}`}
      >
        {sectionTitle}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight ${centered ? 'max-w-3xl mx-auto' : 'max-w-[600px]'}`}
      >
        {mainTitle}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`text-lg text-muted-foreground ${centered ? 'max-w-2xl mx-auto' : 'max-w-[600px]'}`}
      >
        {mainDescription}
      </motion.p>
    </>
  )
}