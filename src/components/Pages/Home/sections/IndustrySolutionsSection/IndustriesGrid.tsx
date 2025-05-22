"use client"

import { motion } from "framer-motion"
import IndustryCard from "./IndustryCard"

interface IndustriesGridProps {
  industries: Array<{
    name: string
    description: string
    icon: string
    color: string
    bgColor: string
  }>
  isInView: boolean
}

export default function IndustriesGrid({ industries, isInView }: IndustriesGridProps) {
  return (
    <>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {industries.map((industry, index) => (
          <IndustryCard 
            key={index} 
            industry={industry} 
            index={index} 
            isInView={isInView} 
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="mt-16 text-center"
      >
        {/* This space can be used for a CTA button or additional content */}
      </motion.div>
    </>
  )
}