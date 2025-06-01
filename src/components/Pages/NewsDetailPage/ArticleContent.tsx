"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Share2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function ArticleContent({ content }) {
    const contentRef = useRef(null)
    const isContentInView = useInView(contentRef, { once: true })
    const { direction } = useLanguage()

    return (
        <div ref={contentRef} className="bg-wtheme-background">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isContentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="prose prose-lg max-w-none font-body text-wtheme-text prose-headings:font-heading prose-headings:text-wtheme-text prose-p:text-wtheme-text prose-li:text-wtheme-text prose-strong:text-wtheme-text prose-a:text-primary prose-blockquote:text-wtheme-text/80 prose-blockquote:border-primary/30"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}