"use client"

import { useState, useEffect } from 'react'
import HeroSection from "@/components/Pages/ServiceDetails/HeroSection"
import OverviewSection from "@/components/Pages/ServiceDetails/OverviewSection"
import FeaturesSection from "@/components/Pages/ServiceDetails/FeaturesSection"
import HowItWorksSection from "@/components/Pages/ServiceDetails/HowItWorksSection"
import FAQSection from "@/components/Pages/ServiceDetails/FAQSection"

import { useLanguage } from "@/contexts/language-context"
import { Loader2 } from "lucide-react"
import { benefitsData, faqData, featuresData, heroData, processStepsData } from '@/components/Pages/ServiceDetails/serviceData'

// Translations for loading and error states
const translations = {
    en: {
        loading: "Loading content...",
        error: "Error loading content. Please try again later.",
        retry: "Retry",
        backToService: "Back To Services"
    },
    ar: {
        loading: "جاري تحميل المحتوى...",
        error: "خطأ في تحميل المحتوى. يرجى المحاولة مرة أخرى لاحقًا.",
        retry: "إعادة المحاولة",
        backToService: "العودة إلى الخدمات"
    }
};

export default function SmartDriveThroughPage() {
    const { language, direction } = useLanguage();
    const t = translations[language] || translations.en;
    
    // State for each section's data
    const [pageHeroData, setPageHeroData] = useState(null);
    const [pageBenefits, setPageBenefits] = useState([]);
    const [pageFeatures, setPageFeatures] = useState([]);
    const [pageProcessSteps, setPageProcessSteps] = useState([]);
    const [pageFaqs, setPageFaqs] = useState([]);
    
    // Loading and error states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // Fetch all page data
    useEffect(() => {
    const fetchPageData = async () => {
        setLoading(true);
        setError(false);
        
        try {
            // Simulate API fetch with setTimeout
            setTimeout(() => {
                // The key fix is here - directly use the language-specific heroData
                setPageHeroData(heroData[language] || heroData.en);
                setPageBenefits(benefitsData[language] || benefitsData.en);
                setPageFeatures(featuresData[language] || featuresData.en);
                setPageProcessSteps(processStepsData[language] || processStepsData.en);
                setPageFaqs(faqData[language] || faqData.en);
                setLoading(false);
            }, 800); // Simulate network delay
        } catch (err) {
            console.error("Error fetching page data:", err);
            setError(true);
            setLoading(false);
        }
    };

    fetchPageData();
    }, [language]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground text-lg">{t.loading}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">{t.error}</h2>
                    <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
                    >
                        {t.retry}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900" dir={direction}>
            {pageHeroData && <HeroSection heroData={pageHeroData} />}

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12">
                <OverviewSection benefits={pageBenefits} />
                <FeaturesSection features={pageFeatures} />
                <HowItWorksSection steps={pageProcessSteps} />
            </div>

            <FAQSection faqs={pageFaqs} />
        </div>
    );
}