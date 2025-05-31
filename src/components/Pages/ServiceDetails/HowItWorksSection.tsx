"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { Car, ShoppingCart, CheckCircle, Truck, Clock, Mic } from "lucide-react"

// Icon mapping for dynamic icons
const iconMap = {
  "Car": Car,
  "ShoppingCart": ShoppingCart,
  "CheckCircle": CheckCircle,
  "Truck": Truck,
  "Clock": Clock,
  "Mic": Mic,
  // Add more icon mappings as needed
};

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
  // Get the icon component from the map, fallback to Car if not found
  const IconComponent = iconMap[step.icon] || Car;
  
  // Clean the title to remove the number prefix if it exists (since we add our own)
  const cleanTitle = step.title.replace(/^\d+\.\s*/, '');
  
  return (
    <Card className="bg-white dark:bg-gray-800 hover:shadow-lg transition-shadow duration-300 h-full">
      <CardContent className="pt-6 flex flex-col h-full">
        <div className="flex items-center justify-center mb-4">
          <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center relative">
            <IconComponent className="h-8 w-8 text-primary" />
            <div className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
              {stepNumber}
            </div>
          </div>
        </div>
        
        <div className="flex-grow flex flex-col">
          <h3 className="text-xl font-semibold mb-3 text-center">
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