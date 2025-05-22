import React from "react"
import Image from "next/image"
import { motion } from "framer-motion"

interface FeaturedImageProps {
  post: {
    image: string
    title: string
  }
}

export const FeaturedImage: React.FC<FeaturedImageProps> = ({ post }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="mb-12 rounded-2xl overflow-hidden shadow-xl shadow-primary/5"
    >
      <Image
        src={post.image || "/placeholder.svg"}
        alt={post.title}
        width={900}
        height={500}
        className="w-full h-auto object-cover"
      />
    </motion.div>
  )
}