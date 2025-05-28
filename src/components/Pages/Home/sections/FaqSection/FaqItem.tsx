// FaqItem.jsx
"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

export const FaqItem = ({ faq, index, isInView, isRTL }) => {
  const [isOpen, setIsOpen] = useState(false)
  const toggleOpen = () => setIsOpen(!isOpen)


  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: 50, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 12,
        delay: 0.3 + index * 0.1,
      }}
      className="group relative"
    >
      {/* Enhanced glass card effect with subtle gradient */}
      <div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-500/5 via-indigo-500/5 to-fuchsia-500/5 opacity-0 ${
          isOpen ? "opacity-100" : "group-hover:opacity-80"
        } transition-opacity duration-300`}
      />

      <motion.div
        className={`relative rounded-2xl ${
          isOpen 
            ? "border-violet-500/40 bg-gradient-to-br from-violet-500/5 to-transparent" 
            : "border-violet-500/10 bg-gradient-to-br from-white/5 to-transparent dark:from-white/2 dark:to-transparent"
        } backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 border`}
        animate={{
          borderColor: isOpen ? "rgba(139, 92, 246, 0.4)" : "rgba(139, 92, 246, 0.1)",
          boxShadow: isOpen ? "0 8px 30px rgba(139, 92, 246, 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
        whileHover={{
          borderColor: "rgba(139, 92, 246, 0.3)",
          boxShadow: "0 8px 30px rgba(139, 92, 246, 0.1)",
          y: -2,
        }}
      >
        <button
          onClick={toggleOpen}
          className={`flex items-center justify-between w-full p-6 text-left ${isRTL ? "flex-row-reverse" : ""}`}
          aria-expanded={isOpen}
        >
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <div className={`
              flex items-center justify-center min-w-10 h-10 rounded-full 
              ${isOpen 
                ? "bg-violet-500 text-white" 
                : "bg-violet-500/10 text-violet-600 dark:text-violet-400"
              } transition-colors duration-300
            `}>
              <span className="text-sm font-medium">{index + 1}</span>
            </div>
            <h3
              className={`text-lg font-medium ${
                isOpen ? "text-violet-600 dark:text-violet-400" : "text-foreground"
              } transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}
            >
              {faq.question}
            </h3>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium">
              {faq.category}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? (isRTL ? -180 : 180) : 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                isOpen ? "bg-violet-500/10 text-violet-600 dark:text-violet-400" : "bg-muted text-muted-foreground"
              } transition-colors duration-300`}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className={`p-6 pt-0 border-t border-violet-500/10 ${isRTL ? "pr-20 text-right" : "pl-20 text-left"} text-muted-foreground`}>
                <p className="leading-relaxed">{faq.answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}