"use client"

import { motion } from "framer-motion"
import type React from "react"

interface SlideContentProps {
  title: string
  description: string
  color: string
  direction: string
  children: React.ReactNode
}

export default function SlideContent({
  title,
  description,
  color,
  direction,
  children
}: SlideContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === 'rtl' ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="flex flex-col justify-center space-y-6 z-10"
    >
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-12 rounded-full bg-gradient-to-r ${color}`}></div>
      </div>

      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none">
        <span className={`bg-clip-text text-transparent bg-gradient-to-r ${color}`}>
          {title}
        </span>
      </h1>

      <p className="text-lg text-muted-foreground max-w-[600px]">
        {description}
      </p>

      {children}
    </motion.div>
  )
}