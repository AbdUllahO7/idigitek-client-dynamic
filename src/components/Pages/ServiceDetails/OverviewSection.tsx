"use client"

import React, { useState, useEffect } from 'react'
import { useLanguage } from "@/contexts/language-context"
import { Loader2 } from "lucide-react"

// This would be replaced by API data in the future
const staticOverviewData = {
  en: {
    title: "Overview",
    paragraphs: [
      "Our Smart Drive-Through Solutions represent the cutting edge of quick-service technology, designed to transform traditional drive-through operations into efficient, accurate, and personalized customer experiences.",
      "By integrating artificial intelligence, digital displays, and advanced queue management systems, we help businesses reduce wait times, increase order accuracy, and boost overall customer satisfaction while maximizing operational efficiency.",
      "Whether you're a fast-food chain, coffee shop, pharmacy, or any business with drive-through capabilities, our solutions can be tailored to meet your specific needs and seamlessly integrate with your existing systems."
    ],
    benefitsTitle: "Key Benefits"
  },
  ar: {
    title: "نظرة عامة",
    paragraphs: [
      "تمثل حلول خدمة السيارات الذكية لدينا أحدث ما توصلت إليه تكنولوجيا الخدمة السريعة، وهي مصممة لتحويل عمليات خدمة السيارات التقليدية إلى تجارب عملاء فعالة ودقيقة ومخصصة.",
      "من خلال دمج الذكاء الاصطناعي والشاشات الرقمية وأنظمة إدارة الطوابير المتقدمة، نساعد الشركات على تقليل أوقات الانتظار، وزيادة دقة الطلبات، وتعزيز رضا العملاء بشكل عام مع تحقيق أقصى قدر من الكفاءة التشغيلية.",
      "سواء كنت سلسلة مطاعم وجبات سريعة أو مقهى أو صيدلية أو أي شركة بها إمكانيات خدمة السيارات، يمكن تخصيص حلولنا لتلبية احتياجاتك المحددة ودمجها بسلاسة مع أنظمتك الحالية."
    ],
    benefitsTitle: "الفوائد الرئيسية"
  }
};

// Translations for loading and error states
const translations = {
  en: {
    loading: "Loading overview information...",
    error: "Error loading content. Please try again later.",
    retry: "Retry"
  },
  ar: {
    loading: "جاري تحميل معلومات النظرة العامة...",
    error: "خطأ في تحميل المحتوى. يرجى المحاولة مرة أخرى لاحقًا.",
    retry: "إعادة المحاولة"
  }
};

const OverviewSection = ({ benefits }) => {
  const { language, direction } = useLanguage();
  const t = translations[language] || translations.en;
  
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch overview data - this would be replaced with an actual API call
  useEffect(() => {
    const fetchOverviewData = async () => {
      setLoading(true);
      setError(false);
      
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch(`/api/services/smart-drive-through/overview?lang=${language}`);
        // const data = await response.json();
        
        // Simulating API fetch with setTimeout
        setTimeout(() => {
          setOverviewData(staticOverviewData[language] || staticOverviewData.en);
          setLoading(false);
        }, 600); // Simulate network delay
      } catch (err) {
        console.error("Error fetching overview data:", err);
        setError(true);
        setLoading(false);
      }
    };

    fetchOverviewData();
  }, [language]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">{t.loading}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold mb-4 text-red-500">{t.error}</h3>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
        >
          {t.retry}
        </button>
      </div>
    );
  }

  if (!overviewData) return null;

  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16" dir={direction}>
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold mb-6">{overviewData.title}</h2>
        {overviewData.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="bg-primary/5 dark:bg-primary/10 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">{overviewData.benefitsTitle}</h3>
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <BenefitItem 
              key={index} 
              Icon={benefit.icon} 
              title={benefit.title} 
              description={benefit.description} 
              direction={direction}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

const BenefitItem = ({ Icon, title, description, direction }) => {
  return (
    <li className="flex">
      <div className={`${direction === 'rtl' ? 'ml-4' : 'mr-4'} mt-1 text-primary`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <h4 className="font-medium">{title}</h4>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </li>
  )
}

export default OverviewSection