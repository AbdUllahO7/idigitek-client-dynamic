"use client"

import { ReactNode } from "react"
import { motion } from "@/components/ui/framer-motion"

interface ContactInfoItemProps {
  icon: ReactNode
  title: string
  content: ReactNode
  isRTL: boolean
}

export function ContactInfoItem({ icon, title, content, isRTL }: ContactInfoItemProps) {
  return (
    <motion.div whileHover={{ x: isRTL ? -5 : 5 }} className={`flex items-start gap-4 ${isRTL ? "" : ""}`}>
      <div className="rounded-full bg-primary/10 p-2 text-primary">
        {icon}
      </div>
      <div className={isRTL ? "text-right" : "text-left"}>
        <h4 className="font-heading font-semibold text-wtheme-text">{title}</h4>
        <p className="text-wtheme-text/70 font-body">{content}</p>
      </div>
    </motion.div>
  )
}