// components/FAQSection.jsx
import { useLanguage } from '@/contexts/language-context'
import React from 'react'

const FAQSection = ({ faqs }) => {

  const { direction } = useLanguage()
  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-8 text-center">{direction === 'rtl' ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}</h2>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <FAQItem 
            key={index} 
            question={faq.question} 
            answer={faq.answer} 
          />
        ))}
      </div>
    </div>
  )
}

const FAQItem = ({ question, answer }) => {
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