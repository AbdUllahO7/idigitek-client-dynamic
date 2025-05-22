"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Send, Check } from "lucide-react"

interface ContactFormProps {
  content: {
    formTitle: string
    fullName: string
    fullNamePlaceholder: string
    emailLabel: string
    emailPlaceholder: string
    subject: string
    subjectPlaceholder: string
    message: string
    messagePlaceholder: string
    sendMessage: string
    sending: string
    messageSent: string
  }
  isRTL: boolean
  direction: string
  handleSubmit: (e: React.FormEvent) => void
  isSubmitting: boolean
  isSubmitted: boolean
}

export function ContactForm({ 
  content, 
  isRTL, 
  direction, 
  handleSubmit, 
  isSubmitting, 
  isSubmitted 
}: ContactFormProps) {
  return (
    <>
      <h3 className={`text-2xl font-bold mb-4 ${isRTL ? "text-right" : "text-left"}`}>{content.formTitle}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className={`text-sm font-medium ${isRTL ? "block text-right" : ""}`}>
              {content.fullName}
            </label>
            <Input 
              id="name" 
              placeholder={content.fullNamePlaceholder} 
              required
              className={isRTL ? "text-right" : ""}
              dir={direction}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className={`text-sm font-medium ${isRTL ? "block text-right" : ""}`}>
              {content.emailLabel}
            </label>
            <Input 
              id="email" 
              type="email" 
              placeholder={content.emailPlaceholder} 
              required
              className={isRTL ? "text-right" : ""}
              dir={direction}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className={`text-sm font-medium ${isRTL ? "block text-right" : ""}`}>
            {content.subject}
          </label>
          <Input 
            id="subject" 
            placeholder={content.subjectPlaceholder} 
            required
            className={isRTL ? "text-right" : ""}
            dir={direction}
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className={`text-sm font-medium ${isRTL ? "block text-right" : ""}`}>
            {content.message}
          </label>
          <Textarea
            id="message"
            placeholder={content.messagePlaceholder}
            className={`min-h-[120px] ${isRTL ? "text-right" : ""}`}
            required
            dir={direction}
          />
        </div>
        <Button 
          type="submit" 
          className={`w-full btn-gradient text-white ${isRTL ? "flex flex-row-reverse justify-center" : ""}`} 
          disabled={isSubmitting || isSubmitted}
        >
          {isSubmitting ? (
            <>
              {content.sending} <Send className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4 animate-pulse ${isRTL ? "rotate-180" : ""}`} />
            </>
          ) : isSubmitted ? (
            <>
              {content.messageSent} <Check className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
            </>
          ) : (
            <>
              {content.sendMessage} <Send className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </>
          )}
        </Button>
      </form>
    </>
  )
}