import React from "react"
import { motion } from "framer-motion"
import { Package, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { FadeIn } from "@/utils/lightweightAnimations"

export const ProductNotFound: React.FC = () => {
  const { direction } = useLanguage()

  return (
    <div className="min-h-screen bg-wtheme-background flex items-center justify-center p-4" dir={direction}>
      <FadeIn
   
        className="text-center max-w-md mx-auto"
      >
        <FadeIn
         
          className="mb-8"
        >
          <Package className="w-24 h-24 mx-auto text-gray-400" />
        </FadeIn>

        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl font-bold text-wtheme-text mb-4"
        >
          Product Not Found
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-gray-600 mb-8 leading-relaxed"
        >
          Sorry, the product you're looking for doesn't exist or has been removed.
        </motion.p>

        <FadeIn
        
        >
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link href="/products" className="inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Products
            </Link>
          </Button>
        </FadeIn>
      </FadeIn>
    </div>
  )
}