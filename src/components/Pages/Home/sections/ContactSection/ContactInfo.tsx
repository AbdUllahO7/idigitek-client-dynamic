"use client"

import { motion } from "@/components/ui/framer-motion"
import { Phone, Mail, MapPin } from "lucide-react"
import { ContactInfoItem } from "./ContactInfoItem"

interface ContactInfoProps {
  content: {
    contactInfo: string
    contactInfoDesc: string
    phone: string
    phoneNumber: string
    email: string
    emailAddress: string
    office: string
    address: {
      line1: string
      line2: string
      line3: string
    }
  }
  isRTL: boolean
}

export function ContactInfo({ content, isRTL }: ContactInfoProps) {
  return (
    <>
      <div className={isRTL ? "text-right" : "text-left"}>
        <h3 className="text-2xl font-bold mb-4">{content.contactInfo}</h3>
        <p className="text-muted-foreground mb-6">
          {content.contactInfoDesc}
        </p>
      </div>

      <div className="space-y-4">
        <ContactInfoItem 
          icon={<Phone className="h-5 w-5" />} 
          title={content.phone} 
          content={content.phoneNumber} 
          isRTL={isRTL} 
        />

        <ContactInfoItem 
          icon={<Mail className="h-5 w-5" />} 
          title={content.email} 
          content={content.emailAddress} 
          isRTL={isRTL} 
        />

        <ContactInfoItem 
          icon={<MapPin className="h-5 w-5" />} 
          title={content.office} 
          content={
            <>
              {content.address.line1}
              <br />
              {content.address.line2}
              <br />
              {content.address.line3}
            </>
          } 
          isRTL={isRTL} 
        />
      </div>

      <div className="rounded-lg overflow-hidden h-64 border">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d1503.1107303631504!2d28.756808521597506!3d41.10785420764287!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14caafc44acaaab1%3A0xdcc4e8667013e001!2siDIGITEK%20(Dijital%20Eser)!5e0!3m2!1sen!2str!4v1742550277399!5m2!1sen!2str"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          title="Office Location"
        ></iframe>
      </div>
    </>
  )
}