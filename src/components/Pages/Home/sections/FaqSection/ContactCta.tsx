// ContactCta.jsx
"use client"

import React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export const ContactCta = ({ content, isInView, isRTL }) => {
  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 50, damping: 15, delay: 0.8 }}
      className="mt-28 max-w-3xl mx-auto"
    >
      <div className="relative overflow-hidden rounded-3xl">
        {/* Enhanced animated gradient border with glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600 via-indigo-600 to-fuchsia-600 p-[2px] rounded-3xl before:absolute before:inset-0 before:bg-gradient-to-r before:from-violet-600 before:via-indigo-600 before:to-fuchsia-600 before:blur-xl before:opacity-50 animate-[gradient_8s_ease_infinite]" />

        <div className="relative rounded-[calc(1.5rem-2px)] bg-black/80 backdrop-blur-xl p-12 overflow-hidden">
          {/* Enhanced glass morphism effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
          
          {/* Subtle radial gradient */}
          <div className="absolute inset-0 bg-radial-gradient" />
          
          {/* Enhanced animated background glow */}
          <div className="absolute top-0 right-1/4 w-1/2 h-1/2 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 flex flex-col items-center text-center gap-8">
            <div className="relative">
              {/* Outer glow effect */}
              <div className="absolute inset-0 bg-violet-500/20 rounded-full blur-xl animate-pulse" />
              
              {/* Icon container with gradient */}
              <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-violet-600 via-indigo-600 to-fuchsia-600 shadow-lg shadow-indigo-600/30">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-300">
                {content.stillHaveQuestions}
              </h3>
              <p className="text-lg text-white/70">
                {content.supportMessage}
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className={`group relative overflow-hidden bg-gradient-to-r from-violet-500 via-indigo-600 to-fuchsia-600 hover:from-violet-600 hover:via-indigo-700 hover:to-fuchsia-700 text-white px-12 h-16 rounded-full shadow-lg shadow-indigo-600/30 border-0`}
            >
              <Link href="#contact" className={`flex items-center gap-3 font-medium text-base ${isRTL ? "flex-row-reverse" : ""}`}>
                {content.contactButton}
                <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isRTL ? "rotate-180 group-hover:-translate-x-1" : "group-hover:translate-x-1"}`} />
                <span className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}