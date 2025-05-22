"use client"

import { useState } from "react"
import { motion } from "@/components/ui/framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"
import { ContactHeader } from "./ContactHeader"
import { translationsDataContact } from "../../ConstData/ConstData"
import { ContactInfo } from "./ContactInfo"
import { ContactForm } from "./ContactForm"


export default function ContactSection() {
  const { ref, isInView } = useScrollAnimation()
  const { direction, language } = useLanguage()
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const isRTL = direction === "rtl"

  // Get the correct content based on language
  const content = translationsDataContact[language === "ar" ? "ar" : "en"]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 3000)
    }, 1500)
  }

  return (
    <section id="contact" className="w-full py-12 bg-muted" dir={direction}>
      <div className="container px-4 md:px-6">
        <ContactHeader 
          ref={ref} 
          isInView={isInView} 
          content={content} 
        />

        <div className="mx-auto grid max-w-6xl gap-8 py-12 md:grid-cols-2">
          {/* Contact Information */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: isRTL ? 30 : -30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-8"
          >
            <ContactInfo 
              content={content} 
              isRTL={isRTL} 
            />
          </motion.div>

          {/* Contact Form */}
          <motion.div
            variants={{
              hidden: { opacity: 0, x: isRTL ? -30 : 30 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
            }}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="rounded-xl border bg-background p-6 shadow-sm"
          >
            <ContactForm 
              content={content} 
              isRTL={isRTL} 
              direction={direction} 
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
