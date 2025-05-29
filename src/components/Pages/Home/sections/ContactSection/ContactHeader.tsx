"use client"

import { forwardRef } from "react"
import { motion } from "@/components/ui/framer-motion"

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
        <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary text-primary-foreground hover:bg-primary/80">
          {content.sectionLabel}
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-gradient">{content.sectionTitle}</h2>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            {content.sectionDescription}
          </p>
        </div>
      </motion.div>
    )
  }
)

ContactHeader.displayName = "ContactHeader"