"use client"

import Image from "next/image"
import { motion } from "framer-motion"

interface IndustryCardProps {
  industry: {
    title: string
    excerpt: string
    image: string
    color: string
  }
  index: number
  isInView: boolean
}

export default function IndustryCard({ industry, index, isInView }: IndustryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
      className="group relative overflow-hidden rounded-2xl  border border-wtheme-border/50 shadow-sm hover:shadow-xl transition-all duration-500"
    >
      {/* Gradient background that appears on hover */}
      <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-500 z-0"></div>

      {/* Top gradient bar */}
      <div className={`h-2 w-full bg-gradient-to-r ${industry.color}`}></div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col items-center text-center">
          <IndustryIcon 
            icon={industry.image} 
            name={industry.title} 
          />

          <h3 className="text-xl font-heading mb-3 text-wtheme-text group-hover:text-wtheme-hover transition-colors duration-300">
            {industry.title}
          </h3>

          <p className="text-wtheme-text font-body mb-6">{industry.excerpt}</p>
        </div>
      </div>

      {/* Corner accent */}
      <div className={`absolute -bottom-8 -right-8 w-16 h-16 rounded-full bg-gradient-to-r ${industry.color} opacity-10 group-hover:opacity-30 transition-opacity duration-500`}></div>
    </motion.div>
  )
}

interface IndustryIconProps {
  icon: string
  name: string
}

function IndustryIcon({ icon, name }: IndustryIconProps) {
  return (
    <div
      className={`relative w-16 h-16 mb-6 rounded-2xl p-3 group-hover:scale-110 transition-transform duration-500`}
    >
      <Image
        src={icon || "/placeholder.svg"}
        alt={name}
        width={94}
        height={94}
        className="w-full h-full object-contain"
        priority={true}
      />

      {/* Animated circles */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="absolute -inset-1 rounded-3xl border-2 border-dashed border-primary/20 opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ rotate: 45 }}
      />
    </div>
  )
}