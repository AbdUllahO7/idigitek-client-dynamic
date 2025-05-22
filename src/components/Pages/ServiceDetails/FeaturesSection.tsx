// components/FeaturesSection.jsx
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"

const FeaturesSection = ({ features }) => {

  const {direction } = useLanguage();
  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold mb-8 text-center">{ direction === "rtl" ? 'الميزات الأساسية' :'Core Features'}</h2>
      <Tabs defaultValue={features[0].id} className="w-full">
        <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full h-auto">
          {features.map((feature) => (
            <TabsTrigger key={feature.id} value={feature.id} className="py-3">
              {feature.title}
            </TabsTrigger>
          ))}
        </TabsList>
        
        {features.map((feature) => (
          <TabsContent key={feature.id} value={feature.id} className="mt-6 p-6 border rounded-lg">
            <FeatureContent content={feature.content} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

const FeatureContent = ({ content }) => {
  const { heading, description, features, image, imageAlt, imagePosition } = content
  
  const ContentSection = () => (
    <div>
      <h3 className="text-2xl font-semibold mb-4">{heading}</h3>
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {description}
      </p>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <div className="mr-2 mt-1 text-primary">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </div>
  )
  
  const ImageSection = () => (
    <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden">
      <Image
        src={image}
        alt={imageAlt}
        fill
        className="object-cover"
      />
    </div>
  )

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {imagePosition === "left" ? (
        <>
          <div className="order-2 md:order-1">
            <ImageSection />
          </div>
          <div className="order-1 md:order-2">
            <ContentSection />
          </div>
        </>
      ) : (
        <>
          <ContentSection />
          <ImageSection />
        </>
      )}
    </div>
  )
}

export default FeaturesSection