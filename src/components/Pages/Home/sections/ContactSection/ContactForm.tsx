"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Check } from "lucide-react"



export function ContactForm({ content, isRTL, direction, handleSubmit, isSubmitting, isSubmitted }) {

  // Split the subjects string into an array
  const subjectOptions = content?.subjects.split(",").map((subject) => subject.trim())

  return (
    <>
      <h3 className={`text-2xl font-bold mb-4 ${isRTL ? "text-right" : "text-left"}`}>{content?.title}</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className={`text-sm font-medium ${isRTL ? "block text-right" : ""}`}>
              {content?.fullName}
            </label>
            <Input
              id="name"
              placeholder={content?.fullNamePlaceHolder}
              required
              className={isRTL ? "text-right" : ""}
              dir={direction}
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className={`text-sm font-medium ${isRTL ? "block text-right" : ""}`}>
              {content?.email}
            </label>
            <Input
              id="email"
              type="email"
              placeholder={content?.emailPlaceHolder}
              required
              className={isRTL ? "text-right" : ""}
              dir={direction}
            />
          </div>
        </div>
        <div className="space-y-2">
          <label htmlFor="subject" className={`text-sm font-medium ${isRTL ? "block text-right" : ""}`}>
            Subject
          </label>
          <Select required>
            <SelectTrigger className={isRTL ? "text-right" : ""} dir={direction}>
              <SelectValue placeholder={content?.subjectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {subjectOptions?.map((subject, index) => (
                <SelectItem key={index} value={subject}>
                  {subject}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <label htmlFor="message" className={`text-sm font-medium ${isRTL ? "block text-right" : ""}`}>
            {content?.message}
          </label>
          <Textarea
            id="message"
            placeholder={content?.messagePlaceHolder}
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
              <Send className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4 animate-pulse ${isRTL ? "rotate-180" : ""}`} />
            </>
          ) : isSubmitted ? (
            <>
              {content?.buttonText} <Check className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4`} />
            </>
          ) : (
            <>
              {content?.buttonText}{" "}
              <Send className={`${isRTL ? "mr-2" : "ml-2"} h-4 w-4 ${isRTL ? "rotate-180" : ""}`} />
            </>
          )}
        </Button>
      </form>
    </>
  )
}
