"use client"

import React from 'react'
import { useLanguage } from '@/contexts/language-context'
import { HelpCircle, MessageCircleQuestionIcon } from 'lucide-react'

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
          <HelpCircle className="h-16 w-16 text-wtheme-text mx-auto mb-4" />
          <p className="text-wtheme-text/60 font-body">{noFaqsText}</p>
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
    <div className="bg-wtheme-background border border-dashed border-primary p-6 rounded-lg shadow-xl">
      <h3 className="text-xl font-heading text-primary  mb-3 ">{question}</h3>
      <p className="text-wtheme-text font-body">
        {answer}
      </p>
    </div>
  )
}

export default FAQSection