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
    <motion.span
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="inline-block mb-2 text-body  text-primary tracking-wider  uppercase"
    >
      {sectionTitle}
    </motion.span>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className={`text-3xl md:text-4xl lg:text-5xl font-heading tracking-tight text-wtheme-text ${centered ? 'max-w-3xl mx-auto' : 'max-w-[600px]'}`}
      >
        {mainTitle}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className={`text-lg font-body text-wtheme-text ${centered ? 'max-w-2xl mx-auto' : 'max-w-[600px]'}`}
      >
        {mainDescription}
      </motion.p>
    </>
  )
}