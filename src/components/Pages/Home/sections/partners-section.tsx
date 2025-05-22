"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useScrollAnimation } from "@/hooks/use-scroll-animation"
import { useLanguage } from "@/contexts/language-context"
import { partners, translationsPartners } from "../ConstData/ConstData"
import { useState, useRef, useEffect } from "react"

export default function PartnersSection() {
  const { ref, isInView } = useScrollAnimation()
  const { t, direction, language } = useLanguage()
  const containerRef = useRef<HTMLDivElement>(null)

  const isRTL = direction === "rtl"

  // Get the correct translations based on language
  const content = translationsPartners[language === "ar" ? "ar" : "en"]
  const integrations = content.integrations

  return (
    <section id="partners" className="w-full py-20" dir={direction}>
      <div className="container px-4 md:px-6" ref={containerRef}>
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
            {language === "ar" ? "أهمية" : "Importance"}
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              {content.trusted}
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {content.description}
            </p>
          </div>
        </motion.div>

        {/* Partners Carousel */}
        <div className="mt-12">
          <PartnersCarousel partners={partners} isInView={isInView} isRTL={isRTL} containerRef={containerRef} />
        </div>

        {/* <motion.div
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: {
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.6,
                delay: 0.6,
              },
            },
          }}
          whileHover={{
            y: -5,
            boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
          }}
          className="mt-16 rounded-xl border bg-muted/50 p-6 md:p-8 lg:p-10"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className={`lg:max-w-2xl ${isRTL ? "lg:text-right" : "lg:text-left"}`}>
              <motion.h3
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="text-2xl font-bold"
              >
                {content.integrationTitle}
              </motion.h3>
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="mt-2 text-muted-foreground"
              >
                {content.integrationDesc}
              </motion.p>
            </div>
            <motion.div
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                asChild
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90"
              >
                <Link href="#contact">{content.exploreButton}</Link>
              </Button>
            </motion.div>
          </div>

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.5,
                },
              },
            }}
            className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4"
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 5px 15px -5px rgba(0, 0, 0, 0.1)",
                  borderColor: "var(--primary)",
                }}
                className={`flex items-center gap-2 rounded-lg border bg-background p-3 shadow-sm ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <CheckCircle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">{integration}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div> */}
      </div>
    </section>
  )
}

interface PartnersCarouselProps {
  partners: {
    name: string
    logo: string
  }[]
  isInView: boolean
  isRTL: boolean
  containerRef: React.RefObject<HTMLDivElement>
}

function PartnersCarousel({ partners, isInView, isRTL, containerRef }: PartnersCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { direction } = useLanguage()
  const carouselRef = useRef<HTMLDivElement>(null)
  
  // Initial state with SSR-safe default value
  const [partnersPerView, setPartnersPerView] = useState(6)
  const maxSlides = Math.max(0, partners.length - partnersPerView)
  
  // Correct usage of useEffect for client-side operations
  useEffect(() => {
    // Function to determine partners per view based on screen width
    const getPartnersPerView = () => {
      if (window.innerWidth < 640) return 2;
      if (window.innerWidth < 768) return 3;
      if (window.innerWidth < 1024) return 4;
      return 6;
    };
    
    // Update state based on window size
    const handleResize = () => {
      setPartnersPerView(getPartnersPerView());
    };
    
    // Set initial value
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = () => {
    if (isRTL) {
      setCurrentSlide((prev) => Math.min(prev + 1, maxSlides));
    } else {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    }
  }

  const handleNext = () => {
    if (isRTL) {
      setCurrentSlide((prev) => Math.max(prev - 1, 0));
    } else {
      setCurrentSlide((prev) => Math.min(prev + 1, maxSlides));
    }
  }

  // Mouse parallax effect for navigation buttons
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    setMousePosition({ x, y })
  }

  // Calculate slide width percentage based on partners per view
  const slideWidth = 100 / partnersPerView

  return (
    <div className="relative" onMouseMove={handleMouseMove}>
      {/* Unified Carousel for All Screen Sizes */}
      <div className="relative">
        <div className="overflow-hidden" ref={carouselRef}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              transform: `translateX(${isRTL ? currentSlide * slideWidth : -currentSlide * slideWidth}%)`,
            }}
          >
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="px-2 md:px-4" 
                style={{ 
                  minWidth: `${slideWidth}%`,
                  flex: `0 0 ${slideWidth}%` 
                }}
              >
                <PartnerLogo partner={partner} index={index} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-center mt-8 md:mt-12 gap-4 md:gap-6">
          <motion.div
            style={{
              x: mousePosition.x * -10,
              y: mousePosition.y * -10,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 w-10 h-10 md:w-12 md:h-12 shadow-md hover:shadow-lg"
              onClick={handlePrev}
              disabled={isRTL ? currentSlide >= maxSlides : currentSlide <= 0}
            >
              <ChevronLeft className={`h-4 w-4 md:h-5 md:w-5 ${isRTL ? "rotate-180" : ""}`} />
              <span className="sr-only">Previous</span>
            </Button>
          </motion.div>

          <motion.div
            style={{
              x: mousePosition.x * 10,
              y: mousePosition.y * -10,
            }}
            transition={{ type: "spring", stiffness: 150, damping: 15 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="rounded-full border-primary/20 bg-background/80 backdrop-blur-sm hover:bg-primary/10 hover:text-primary transition-all duration-300 w-10 h-10 md:w-12 md:h-12 shadow-md hover:shadow-lg"
              onClick={handleNext}
              disabled={isRTL ? currentSlide <= 0 : currentSlide >= maxSlides}
            >
              <ChevronRight className={`h-4 w-4 md:h-5 md:w-5 ${isRTL ? "rotate-180" : ""}`} />
              <span className="sr-only">Next</span>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

interface PartnerLogoProps {
  partner: {
    name: string
    logo: string
  }
  index: number
}

function PartnerLogo({ partner, index }: PartnerLogoProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
      whileHover={{
        y: -5,
        boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)",
        borderColor: "var(--primary)",
      }}
      className="flex items-center justify-center rounded-lg border bg-background p-4 shadow-sm h-full"
    >
      <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 300, damping: 10 }}>
        <Image
          src={partner.logo || "/placeholder.svg"}
          alt={partner.name}
          width={120}
          height={80}
          className="h-12 w-auto object-contain grayscale transition-all hover:grayscale-0"
        />
      </motion.div>
    </motion.div>
  )
}