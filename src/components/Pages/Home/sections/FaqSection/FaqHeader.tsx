// FaqHeader.jsx
"use client"

import React from "react"
import { motion } from "framer-motion"
import { MessageCircleQuestion, Search } from "lucide-react"

export const FaqHeader = ({ content, isInView, isRTL, searchQuery, setSearchQuery }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative max-w-3xl mx-auto mb-20 text-center"
        >
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-accent font-medium rounded-full bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm"
        >
            <MessageCircleQuestion className="w-4 h-4" />
            <span>{content.sectionLabel}</span>
        </motion.div>

        <motion.h2
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
            className="text-4xl font-heading font-bold tracking-tight text-wtheme-text sm:text-5xl md:text-6xl"
        >
            <span className="relative inline-block">
            <span className="relative bg-clip-text text-wtheme-text">
                {content.sectionTitle}
            </span>
            </span>
        </motion.h2>

        <motion.p
            initial={{ y: 40, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
            className="mt-6  font-body text-wtheme-text"
        >
            {content.sectionDescription}
        </motion.p>
        </motion.div>
    )
}