"use client"

import { motion } from "framer-motion"
import type React from "react"

interface FeatureCardProps {
  feature: {
    title: string
    description: string
    icon: React.ReactNode
    color: string
    delay: number
  }
  isInView: boolean
}

export default function FeatureCard({ feature, isInView }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay: feature.delay }}
      className="group flex items-start gap-4 rounded-xl p-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-digitek-pink/5 hover:to-digitek-orange/5"
    >
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${feature.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
      >
        {feature.icon}
      </div>
      <div className="space-y-1">
        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
          {feature.title}
        </h3>
        <p className="text-muted-foreground">{feature.description}</p>
      </div>
    </motion.div>
  )
}