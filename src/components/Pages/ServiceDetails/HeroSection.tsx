'use client'

import Image from "next/image"
import { GoBackButton } from "@/components/GoBackButton"
import { useLanguage } from "@/contexts/language-context" // Assuming you have this

const HeroSection = ({ heroData }) => {


    const {
        backgroundImage,
        title,
        description,
        backLinkText,
        sectionId = "services" // Default section to return to
    } = heroData

    const { direction } = useLanguage?.() || { direction: 'ltr' }

    return (
    <div className="relative h-[50vh] md:h-[60vh] w-full">
        <Image
            src={backgroundImage}
            alt={title}
            fill
            className="object-cover"
            priority
        />
        <div className="absolute inset-0 bg-black/50 flex flex-col justify-end">
        <div className="container mx-auto px-4 pb-12">
            {/* go back button  */}
            <GoBackButton sectionName="services" />
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {title}
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
                {description}
            </p>
            </div>
        </div>
        </div>
    )
}

export default HeroSection