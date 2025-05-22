"use client"

import { motion } from "@/components/ui/framer-motion"

interface CtaBackgroundProps {
  isInView: boolean
}

export function CtaBackground({ isInView }: CtaBackgroundProps) {
  return (
    <>
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-purple-500/10 z-0"></div>

      {/* Animated orbs */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
        className="absolute bottom-10 left-10 w-72 h-72 bg-purple-500/5 rounded-full blur-3xl"
      />
    </>
  )
}
