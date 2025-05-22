"use client"

import Link from "next/link"
import Image from "next/image"
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react"
import { motion } from "@/components/ui/framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { ref, isInView } = useScrollAnimation()
  const { t, direction, language } = useLanguage()
  
  const isRTL = direction === "rtl"

  // Translations for both English and Arabic
  const translations = {
    en: {
      companyDesc: "Innovative technology solutions for POS systems, drive-through operations, and custom software development.",
      solutions: "Solutions",
      company: "Company",
      contactUs: "Contact Us",
      allRightsReserved: "All Rights Reserved.",
      privacyPolicy: "Privacy Policy",
      termsOfService: "Terms of Service",
      cookiePolicy: "Cookie Policy",
      solutionsLinks: [
        { label: "POS Systems", href: "#" },
        { label: "Drive-Through Technology", href: "#" },
        { label: "Custom Software", href: "#" },
        { label: "Mobile Applications", href: "#" },
      ],
      companyLinks: [
        { label: "About Us", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Press", href: "#" },
      ],
      contactInfo: [
        { icon: <Phone className="mt-0.5 h-4 w-4 text-primary" />, text: "+1 (555) 123-4567" },
        { icon: <Mail className="mt-0.5 h-4 w-4 text-primary" />, text: "info@Idigiteksolutions.com" },
        { 
          icon: <MapPin className="mt-0.5 h-4 w-4 text-primary" />,
          text: "123 Tech Plaza, Suite 400\nSan Francisco, CA 94103" 
        },
      ],
      socialMedia: [
        { icon: <Twitter className="h-5 w-5" />, label: "Twitter" },
        { icon: <Facebook className="h-5 w-5" />, label: "Facebook" },
        { icon: <Instagram className="h-5 w-5" />, label: "Instagram" },
        { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn" },
      ]
    },
    ar: {
      companyDesc: "حلول تكنولوجية مبتكرة لأنظمة نقاط البيع وعمليات خدمة السيارات وتطوير البرمجيات المخصصة.",
      solutions: "الحلول",
      company: "الشركة",
      contactUs: "اتصل بنا",
      allRightsReserved: "جميع الحقوق محفوظة.",
      privacyPolicy: "سياسة الخصوصية",
      termsOfService: "شروط الخدمة",
      cookiePolicy: "سياسة ملفات تعريف الارتباط",
      solutionsLinks: [
        { label: "أنظمة نقاط البيع", href: "#" },
        { label: "تكنولوجيا خدمة السيارات", href: "#" },
        { label: "البرمجيات المخصصة", href: "#" },
        { label: "تطبيقات الهاتف المحمول", href: "#" },
      ],
      companyLinks: [
        { label: "من نحن", href: "#" },
        { label: "وظائف", href: "#" },
        { label: "المدونة", href: "#" },
        { label: "الصحافة", href: "#" },
      ],
      contactInfo: [
        { icon: <Phone className="mt-0.5 h-4 w-4 text-primary" />, text: "+1 (555) 123-4567" },
        { icon: <Mail className="mt-0.5 h-4 w-4 text-primary" />, text: "info@Idigiteksolutions.com" },
        { 
          icon: <MapPin className="mt-0.5 h-4 w-4 text-primary" />,
          text: "123 تك بلازا، جناح 400\nسان فرانسيسكو، كاليفورنيا 94103" 
        },
      ],
      socialMedia: [
        { icon: <Twitter className="h-5 w-5" />, label: "تويتر" },
        { icon: <Facebook className="h-5 w-5" />, label: "فيسبوك" },
        { icon: <Instagram className="h-5 w-5" />, label: "انستغرام" },
        { icon: <Linkedin className="h-5 w-5" />, label: "لينكد إن" },
      ]
    }
  }

  // Get the correct content based on language
  const content = translations[language === "ar" ? "ar" : "en"]

  return (
    <motion.footer
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      id="contact"
      className="w-full border-t bg-muted py-12 md:py-16"
      dir={direction}
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}
          >
            <div className={`flex items-center gap-2 ${isRTL ? "justify-end" : "justify-start"}`}>
              <Image
                src="/assets/iDIGITEK.webp"
                alt="Idigitek Solutions Logo"
                width={100}
                height={100}
                className="rounded"
              />
            </div>
            <p className="text-sm text-muted-foreground">
              {content.companyDesc}
            </p>
            <div className={`flex ${isRTL ? "space-x-reverse space-x-4 justify-end" : "space-x-4"}`}>
              {content.socialMedia.map((social, index) => (
                <motion.div
                  key={social.label}
                  whileHover={{ scale: 1.2, color: "var(--primary)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Link href="#" className="text-muted-foreground hover:text-foreground">
                    {social.icon}
                    <span className="sr-only">{social.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <FooterColumn
            title={content.solutions}
            links={content.solutionsLinks}
            isRTL={isRTL}
          />

          <FooterColumn
            title={content.company}
            links={content.companyLinks}
            isRTL={isRTL}
          />

          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}
          >
            <h3 className="text-lg font-semibold">{content.contactUs}</h3>
            <ul className="space-y-2">
              {content.contactInfo.map((item, index) => (
                <motion.li
                  key={index}
                  className={`flex items-start gap-2 ${isRTL ? "" : ""}`}
                  whileHover={{ x: isRTL ? -5 : 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {item.icon}
                  <span className="text-sm text-muted-foreground">{item.text}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { delay: 0.5, duration: 0.5 } },
          }}
          className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground"
        >
          <p>
            © {new Date().getFullYear()} Idigitek Solutions. {content.allRightsReserved}
          </p>
          <div className={`mt-2 flex justify-center ${isRTL ? "space-x-reverse" : ""} space-x-4`}>
            {[
              { label: content.privacyPolicy, href: "#" },
              { label: content.termsOfService, href: "#" },
              { label: content.cookiePolicy, href: "#" },
            ].map((item) => (
              <Link key={item.label} href={item.href} className="hover:underline hover:text-primary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  )
}

interface FooterColumnProps {
  title: string
  links: { label: string; href: string }[]
  isRTL: boolean
}

function FooterColumn({ title, links, isRTL }: FooterColumnProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
      }}
      className={`space-y-4 ${isRTL ? "text-right" : "text-left"}`}
    >
      <h3 className={`text-lg font-semibold  `}>{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <motion.li
            key={link.label}
            whileHover={{ x: isRTL ? -5 : 5 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground">
              {link.label}
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  )
}