"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowRight, ShoppingCart, Car, Code, Loader2 } from "lucide-react"
import { useInView } from "framer-motion"
import { motion } from "framer-motion"
import { ButtonSectionLink } from "@/components/SectionLinks"
import { useLanguage } from "@/contexts/language-context"
import { useSectionLogic } from "@/hooks/useSectionLogic"
import { useSectionContent } from "@/hooks/useSectionContent"

// Component to render specific icons based on name
const DynamicIcon = ({ name, className }) => {
  switch (name) {
    case 'ShoppingCart':
      return <ShoppingCart className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Code':
      return <Code className={className} />;
    default:
      return <Code className={className} />;
  }
};

export default function ServicesSection({ sectionId, websiteId }) {
  const { language } = useLanguage();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.1 });

  const { content, isLoading: sectionLoading, error: sectionError, refetch, direction } = useSectionLogic({
    sectionId,
    websiteId,
    itemsKey: "news",
  })


  const serviceFilter = (item: { title: string }) => item.title && item.title.trim() !== ""

  const { contentItems, isLoading: itemsLoading, error: itemsError } = useSectionContent({
    sectionId,
    websiteId,
    filter : serviceFilter,
    fieldMappings: {
      id: "_id",
      image: "Background Image",
      title: "Title",
      description: "Description", // Changed from excerpt to description to match usage
      BackButton: "Back Link Text",
      readMore: "service Details",
      date: "createdAt",
      color: () => "from-digitek-orange to-digitek-pink"
    }
  })




  const isLoading = sectionLoading || itemsLoading
  const error = sectionError || itemsError

  return (
    <section id="services" className="w-full pb-10 pt-10 bg-gradient-to-b from-background to-muted overflow-hidden">
      <div className="container px-4 md:px-6">
        <div ref={ref} className="mb-16 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-2 text-sm font-medium tracking-wider text-primary uppercase"
          >
            {content.sectionLabel}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4"
          >
            {content.sectionTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl mx-auto text-muted-foreground text-lg"
          >
            {content.sectionDescription}
          </motion.p>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">{content.loading || "Loading..."}</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">{content.error}</p>
            <Button onClick={() => refetch()} variant="outline" className="mt-4">
              {content.retry}
            </Button>
          </div>
        ) : contentItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <p className="text-muted-foreground">{content.error}</p>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
              {content.retry}
            </Button>
          </div>
        ) : (
          <div className="grid gap-12">
            {contentItems.map((service, index) => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                index={index} 
                direction={direction}
                serviceDetails={content.readMore}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

interface ServiceCardProps {
  service: {
    id: string;
    title: string;
    description: string;
    icon: string;
    image: string;
    slug: string;
  };
  index: number;
  direction: string;
  serviceDetails: string;
}

function ServiceCard({ service, index, direction, serviceDetails }: ServiceCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.2 });
  const isEven = index % 2 === 0;
  const isRTL = direction === "rtl";
  
  // Adjust flex direction based on both index and language direction
  const getFlexDirection = () => {
    if (isRTL) {
      // For RTL: Even indexes should be row-reverse, odd indexes should be row
      return isEven ? "lg:flex-row-reverse" : "lg:flex-row";
    } else {
      // For LTR: Even indexes should be row, odd indexes should be row-reverse
      return isEven ? "lg:flex-row" : "lg:flex-row-reverse";
    }
  };

  // Adjust animation direction based on both index and language direction
  const getAnimationDirection = (isLeft) => {
    if (isRTL) {
      // Invert animation directions for RTL
      if (isEven) {
        return isLeft ? 50 : -50;
      } else {
        return isLeft ? -50 : 50;
      }
    } else {
      if (isEven) {
        return isLeft ? -50 : 50;
      } else {
        return isLeft ? 50 : -50;
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } },
      }}
      className="relative"
    >
      <div className={`flex flex-col ${getFlexDirection()} gap-8 items-center`}>
        <motion.div
          initial={{ opacity: 0, x: getAnimationDirection(true) }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: getAnimationDirection(true) }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full lg:w-1/2"
        >
          <div className="relative overflow-hidden rounded-2xl shadow-2xl aspect-video">
            <Image
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: getAnimationDirection(false) }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: getAnimationDirection(false) }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="w-full lg:w-1/2"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
              <DynamicIcon name={service.icon} className="h-8 w-8" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold">{service.title}</h3>
          </div>

          <p className="text-muted-foreground text-lg mb-6">{service.description}</p>
          <ButtonSectionLink 
            href={`/Pages/ServiceDetailsPage/${service.id}`}
            className="group bg-neutral-900 text-neutral-50 bg-gradient-to-tr from-digitek-pink to-digitek-purple shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-white dark:hover:bg-neutral-50/90"
          >
            {serviceDetails}
            <ArrowRight className={`${isRTL ? 'mr-2 rotate-180' : 'ml-2'} h-4 w-4 transition-transform duration-300 ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </ButtonSectionLink>
        </motion.div>
      </div>
    </motion.div>
  )
}