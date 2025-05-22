"use client"

import { forwardRef } from "react"
import { motion } from "@/components/ui/framer-motion"
import { CtaHeader } from "./CtaHeader"
import { CtaForm } from "./CtaForm"


interface CtaCardProps {
    content: any
    isInView: boolean
    direction: string
}

export const CtaCard = forwardRef<HTMLDivElement, CtaCardProps>(
    ({ content, isInView, direction }, ref) => {
        const isRTL = direction === "rtl"

        return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
                opacity: 1,
                y: 0,
                transition: {
                duration: 0.6,
                when: "beforeChildren",
                staggerChildren: 0.1,
                },
            },
            }}
            whileHover={{
            y: -5,
            boxShadow: "0 20px 40px -20px rgba(0, 0, 0, 0.2)",
            }}
            className="mx-auto max-w-3xl rounded-2xl border bg-background p-6 shadow-xl md:p-10 lg:p-12"
        >
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <CtaHeader content={content} />
            <CtaForm content={content} direction={direction} isRTL={isRTL} />
            </div>
        </motion.div>
        )
    }
)

CtaCard.displayName = "CtaCard"