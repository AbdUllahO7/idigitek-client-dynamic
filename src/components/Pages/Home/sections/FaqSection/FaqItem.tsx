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
      {/* Enhanced glass card effect with theme gradient */}
      <div
        className={`absolute inset-0 rounded-2xl bg-primary/5 opacity-0 ${
          isOpen ? "opacity-100" : "group-hover:opacity-80"
        } transition-opacity duration-300`}
      />

      <motion.div
        className={`relative rounded-2xl ${
          isOpen 
            ? "border-primary/40 bg-gradient-to-br from-primary/5 to-transparent" 
            : "border-primary/10 bg-gradient-to-br from-wtheme-background/50 to-transparent"
        } backdrop-blur-sm shadow-sm overflow-hidden transition-all duration-300 border bg-wtheme-background`}
        animate={{
          borderColor: isOpen ? "var(--website-theme-primary)" : "rgba(var(--website-theme-primary), 0.1)",
          boxShadow: isOpen ? "0 8px 30px rgba(var(--website-theme-primary), 0.1)" : "0 1px 3px rgba(0, 0, 0, 0.05)",
        }}
        whileHover={{
          borderColor: "rgba(var(--website-theme-primary), 0.3)",
          boxShadow: "0 8px 30px rgba(var(--website-theme-primary), 0.1)",
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
                ? "bg-primary text-white" 
                : "bg-primary/10 text-primary"
              } transition-colors duration-300
            `}>
              <span className="text-sm font-accent font-medium">{index + 1}</span>
            </div>
            <h3
              className={`text-lg font-heading font-medium ${
                isOpen ? "text-primary" : "text-wtheme-text"
              } transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}
            >
              {faq.question}
            </h3>
          </div>
          <div className={`flex items-center gap-3 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="text-xs font-accent px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
              {faq.category || "General"}
            </span>
            <motion.div
              animate={{ rotate: isOpen ? (isRTL ? -180 : 180) : 0 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
              className={`flex items-center justify-center w-8 h-8 rounded-full ${
                isOpen ? "bg-primary/10 text-primary" : "bg-wtheme-text/10 text-wtheme-text/60"
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
              <div className={`p-6 pt-0 border-t border-primary/10 ${isRTL ? "pr-20 text-right" : "pl-20 text-left"} text-wtheme-text/70`}>
                <p className="leading-relaxed font-body">{faq.answer}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}