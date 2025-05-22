"use client"

import { motion } from "framer-motion"

export default function BackgroundElements() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-background"></div>
      <div className="absolute top-0 right-0 w-full h-40 bg-grid-pattern opacity-5 transform -rotate-3"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-grid-pattern opacity-5 transform rotate-3"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute top-1/3 left-0 w-96 h-96 rounded-full bg-digitek-pink blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
        className="absolute bottom-1/3 right-0 w-96 h-96 rounded-full bg-digitek-orange blur-3xl"
      />
    </>
  )
}