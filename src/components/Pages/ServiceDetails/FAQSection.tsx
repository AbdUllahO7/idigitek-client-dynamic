"use client"

import React from 'react'
import { useLanguage } from '@/contexts/language-context'

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