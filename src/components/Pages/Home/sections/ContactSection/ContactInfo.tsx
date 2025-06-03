"use client"
import { Phone, Mail, MapPin } from "lucide-react"
import { ContactInfoItem } from "./ContactInfoItem"

export function ContactInfo({ content, isRTL }) {

  return (
    <>
      <div className={isRTL ? "text-right" : "text-left"}>
        <h3 className=" font-heading text-xl  mb-4 text-wtheme-text">{content?.title}</h3>
        <p className="text-wtheme-text font-body mb-6">{content?.description}</p>
      </div>

      <div className="space-y-4">
        <ContactInfoItem
          icon={<Phone className="h-5 w-5" />}
          title={content?.phone}
          content={content?.phoneValue}
          isRTL={isRTL}
        />

        <ContactInfoItem
          icon={<Mail className="h-5 w-5" />}
          title={content?.email}
          content={content?.emailValue}
          isRTL={isRTL}
        />
          <ContactInfoItem
            icon={<MapPin className="h-5 w-5" />}
            title={content?.officeText}
            content={<>{content?.officeValue}</>}
            isRTL={isRTL}
          />
      </div>
    </>
  )
}