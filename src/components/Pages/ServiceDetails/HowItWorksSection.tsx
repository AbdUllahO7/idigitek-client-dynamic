// components/HowItWorksSection.jsx
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"

const HowItWorksSection = ({ steps }) => {

  const {direction} = useLanguage()

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">{direction === "rtl" ? 'كيف يعمل' : 'How It Works'}</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {steps.map((step, index) => (
          <ProcessStep 
            key={index} 
            Icon={step.icon} 
            title={`${index + 1}. ${step.title}`} 
            description={step.description} 
          />
        ))}
      </div>
    </div>
  )
}

const ProcessStep = ({ Icon, title, description }) => {
  return (
    <Card className="bg-white dark:bg-gray-800">
      <CardContent className="pt-6">
        <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

export default HowItWorksSection