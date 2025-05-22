"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { BarChart, Clock, Shield, Zap } from "lucide-react"
import FeatureHighlight from "./FeatureHighlight"

interface FeatureImageProps {
    isInView: boolean
    featureHighlights: {
        lightningFast: string
        secure: string
        insightful: string
        alwaysAvailable: string
    }
    }

export default function FeatureImage({ isInView, featureHighlights }: FeatureImageProps) {
    return (
        <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="relative mx-auto lg:ml-auto"
        >
        <div className="absolute inset-0 bg-gradient-to-r from-digitek-pink/20 to-digitek-orange/20 rounded-2xl blur-md transform rotate-3 scale-105"></div>

        <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative bg-gradient-to-r p-1 from-digitek-pink to-digitek-orange rounded-2xl shadow-xl"
        >
            <div className="bg-background rounded-xl overflow-hidden">
            <Image
                src="/assets/pngtree-blue-gradient-online-mobile-phone-viewing-png-image_5416290-removebg-preview.png"
                width={600}
                height={600}
                alt="Product Features"
                className="w-full h-auto"
            />
            </div>

            {/* Feature highlights */}
            <FeatureHighlight
            position="top-4 -left-12"
            delay={0.6}
            isInView={isInView}
            color="from-amber-500 to-orange-500"
            icon={<Zap className="h-4 w-4" />}
            text={featureHighlights.lightningFast}
            />

            <FeatureHighlight
            position="top-1/4 -right-12"
            delay={0.8}
            isInView={isInView}
            color="from-blue-500 to-indigo-500"
            icon={<Shield className="h-4 w-4" />}
            text={featureHighlights.secure}
            />

            <FeatureHighlight
            position="bottom-1/4 -left-12"
            delay={1.0}
            isInView={isInView}
            color="from-emerald-500 to-teal-500"
            icon={<BarChart className="h-4 w-4" />}
            text={featureHighlights.insightful}
            />

            <FeatureHighlight
            position="bottom-4 -right-12"
            delay={1.2}
            isInView={isInView}
            color="from-purple-500 to-violet-500"
            icon={<Clock className="h-4 w-4" />}
            text={featureHighlights.alwaysAvailable}
            />
        </motion.div>
        </motion.div>
    )
}