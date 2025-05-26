"use client"

import { motion } from "framer-motion"
import type React from "react"
import FeatureCard from "./FeatureCard"

interface FeaturesListProps {
    features: Array<{
        title: string
        excerpt: string
        icon: React.ReactNode
        color: string
    }>
    isInView: boolean
}

export default function FeaturesList({ features, isInView }: FeaturesListProps) {
    return (
        <>
        <div className="mt-10 grid gap-6">
            {features.map((feature, index) => (
                <FeatureCard key={index} feature={feature} isInView={isInView} />
            ))}
        </div>

        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10"
        >
            {/* Content can be added here in the future */}
        </motion.div>
        </>
    )
}