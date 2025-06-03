"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Car, ShoppingCart, CheckCircle, Truck, Clock, Mic } from "lucide-react"
import { iconMap } from '@/utils/IconMap'



interface ProcessStep {
  id: string;
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  steps: ProcessStep[];
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ steps = [] }) => {
  const { language, direction } = useLanguage();
  
  const noStepsText = language === 'ar' ? 'لا توجد خطوات متاحة' : 'No steps available';

  if (steps.length === 0) {
    return (
      <div className="mb-16 py-16 text-center">
        <p className="text-gray-600 dark:text-gray-400">{noStepsText}</p>
      </div>
    );
  }

  return (
    <div className="mb-16" dir={direction}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {steps.map((step, index) => (
          <ProcessStepCard 
            key={step.id} 
            step={step}
            stepNumber={index + 1}
            direction={direction}
          />
        ))}
      </div>
    </div>
  )
}

interface ProcessStepCardProps {
  step: ProcessStep;
  stepNumber: number;
  direction: string;
}

const ProcessStepCard: React.FC<ProcessStepCardProps> = ({ step, stepNumber, direction }) => {


    const renderIcon = () => {
      if (React.isValidElement(step.icon)) {
        return step.icon; // If it's already a React element, use it
      }
      return iconMap[step.icon as string] || null; // Map string to component, fallback to null
    };
    

  // Clean the title to remove the number prefix if it exists (since we add our own)
  const cleanTitle = step.title.replace(/^\d+\.\s*/, '');
  
  return (
    <Card className=" transition-shadow duration-300 h-full bg-wtheme-background hover:shadow-lg " >
      <CardContent className="pt-6 flex flex-col h-ful l">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full  w-16 h-16 flex items-center justify-center relative">
              {renderIcon()}
            <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {stepNumber}
            </div>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col">
          <h3 className="text-xl mb-3 text-center font-heading text-primary">
            {cleanTitle}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-center leading-relaxed flex-grow">
            {step.description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default HowItWorksSection