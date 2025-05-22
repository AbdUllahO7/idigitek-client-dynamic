"use client"

import { motion } from "framer-motion"

interface SectionHeaderProps {
  isInView: boolean
  sectionTitle: string
  mainTitle: string
  mainDescription: string
}

export default function SectionHeader({ 
  isInView, 
  sectionTitle, 
  mainTitle, 
  mainDescription 
}: SectionHeaderProps) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium w-fit"
      >
        {sectionTitle}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-4 text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight"
      >
        {mainTitle}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-4 text-lg text-muted-foreground max-w-[600px]"
      >
        {mainDescription}
      </motion.p>
    </>
  )
}