"use client"

import React from 'react'
import { useLanguage } from '@/contexts/language-context'
import { HelpCircle } from 'lucide-react'

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs = [] }) => {
  const { language, direction } = useLanguage();
  
  const noFaqsText = language === 'ar' ? 'لا توجد أسئلة شائعة متاحة' : 'No FAQs available';

  if (faqs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="text-center py-16">
          <HelpCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">{noFaqsText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12" dir={direction}>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {faqs.map((faq) => (
          <FAQItem 
            key={faq.id} 
            question={faq.question} 
            answer={faq.answer} 
          />
        ))}
      </div>
    </div>
  )
}

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-3">{question}</h3>
      <p className="text-gray-700 dark:text-gray-300">
        {answer}
      </p>
    </div>
  )
}

export default FAQSection