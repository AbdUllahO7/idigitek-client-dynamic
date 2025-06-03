"use client"

import { forwardRef } from "react"
import { motion } from "@/components/ui/framer-motion"
import { BookOpen, PhoneCall } from "lucide-react"

interface ContactHeaderProps {
  isInView: boolean
  content: {
    sectionLabel: string
    sectionTitle: string
    sectionDescription: string
  }
}

export const ContactHeader = forwardRef<HTMLDivElement, ContactHeaderProps>(
  ({ isInView, content }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 },
          },
        }}
        className="flex flex-col items-center justify-center space-y-4 text-center"
      >
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 md:px-5 md:py-2 text-xs md:text-sm font-accent font-medium text-primary backdrop-blur-sm shadow-sm"
          >
            <PhoneCall className="h-3 w-3 md:h-4 md:w-4" />
            <span>{content.sectionLabel}</span>
          </motion.div>
        <div className="space-y-2">
          <h2 className="text-3xl font-heading font-bold tracking-tighter sm:text-5xl text-wtheme-text">{content.sectionTitle}</h2>
          <p className="max-w-[900px] text-wtheme-text font-body md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {content.sectionDescription}
          </p>
        </div>
      </motion.div>
    )
  }
)

ContactHeader.displayName = "ContactHeader"