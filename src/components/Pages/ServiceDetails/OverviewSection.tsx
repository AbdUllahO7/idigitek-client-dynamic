"use client"

import React from 'react'
import { useLanguage } from "@/contexts/language-context"
import { iconMap } from '@/utils/IconMap';

// Icon mapping for dynamic icons


interface BenefitItemProps {
  iconName: string;
  title: string;
  description: string;
  direction: string;
}

interface OverviewSectionProps {
  benefits: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
  }>;
  overviewData?: {
    title?: string;
    description?: string;
  };
}

const OverviewSection: React.FC<OverviewSectionProps> = ({ benefits = [], overviewData }) => {
  const { language, direction } = useLanguage();

  // Only use dynamic data from overviewData
  const title = overviewData?.title || "";
  const description = overviewData?.description || "";

  // Split description into paragraphs
  const paragraphs = description ? description.split('\n\n').filter(p => p.trim()) : [];


 
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-16" dir={direction}>
      <div className="md:col-span-2">
        {title && <h2 className="text-3xl font-bold mb-6 text-wtheme-text">{title}</h2>}
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-lg text-wtheme-text mb-6 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      <div className="bg-primary/5 rounded-xl p-6">
        {benefits && benefits.length > 0 ? (
          <ul className="space-y-4">
            {benefits.map((benefit) => (
              <BenefitItem 
                key={benefit.id} 
                iconName={benefit.icon}
                title={benefit.title} 
                description={benefit.description} 
                direction={direction}
              />
            ))}
          </ul>
        ) : (
          <p className="text-wtheme-text/60">
          </p>
        )}
      </div>
    </div>
  )
}

const BenefitItem: React.FC<BenefitItemProps> = ({ iconName, title, description, direction }) => {


   const renderIcon = () => {
      if (React.isValidElement(iconName)) {
        return iconName; // If it's already a React element, use it
      }
      return iconMap[iconName as string] || null; // Map string to component, fallback to null
    };
  
  // Clean up description - remove any duplicate titles or mixed content
  const cleanDescription = (desc: string) => {
    if (!desc) return '';
    
    // Split by newline and filter out empty lines or lines that match the title
    const lines = desc.split('\n').filter(line => 
      line.trim() && 
      line.trim() !== title &&
      !line.includes('Reduced Wait Times') // Remove any English duplicates in Arabic content
    );
    
    // Return the first meaningful line
    return lines[0] || desc;
  };
  
  return (
    <li className="flex">
      <div className={`${direction === 'rtl' ? 'ml-4' : 'mr-4'} mt-1 text-primary`}>
        {renderIcon()}
      </div>
      <div>
        <h4 className="font-body text-wtheme-text">{title}</h4>
        <p className="text-wtheme-text/70 text-sm">
          {cleanDescription(description)}
        </p>
      </div>
    </li>
  )
}

export default OverviewSection