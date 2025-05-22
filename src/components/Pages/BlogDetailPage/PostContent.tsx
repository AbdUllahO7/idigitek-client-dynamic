import React from "react"
import { motion } from "framer-motion"

interface PostContentProps {
  post: {
    excerpt: string
  }
  isRTL: boolean
}

export const PostContent: React.FC<PostContentProps> = ({ post, isRTL }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`prose max-w-none dark:prose-invert mb-14 ${isRTL ? "text-right" : ""}`}
    >
      <p className="text-lg leading-relaxed text-muted-foreground">
        {post.excerpt}
      </p>
      
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ullamcorper mattis lorem non. Ultrices praesent amet ipsum justo massa. Eu dolor aliquet risus gravida nunc at feugiat consequat purus. Non massa enim vitae duis mattis. Vel in ultricies vel fringilla.
      </p>
      
      <h2>Transforming the digital landscape</h2>
      
      <p>
        Mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien et. Viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare. Libero id faucibus nisl tincidunt eget nullam. Mattis enim ut tellus elementum sagittis vitae et leo. Sed viverra tellus in hac habitasse platea dictumst vestibulum. Amet nulla facilisi morbi tempus iaculis. In hac habitasse platea dictumst vestibulum.
      </p>
      
      <blockquote>
        "Technology is best when it brings people together."
        <cite>— Matt Mullenweg, Founder of WordPress</cite>
      </blockquote>
      
      <p>
        Fermentum leo vel orci porta non pulvinar neque laoreet. Id porta nibh venenatis cras sed felis eget. Gravida cum sociis natoque penatibus et magnis dis parturient montes. Amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet. Amet risus nullam eget felis eget nunc lobortis mattis.
      </p>
      
      <h3>Embracing innovation</h3>
      
      <p>
        Rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis. Viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare. Libero id faucibus nisl tincidunt eget nullam. Mattis enim ut tellus elementum sagittis vitae et leo. Sed viverra tellus in hac habitasse platea dictumst vestibulum.
      </p>
      
      <p>
        Amet nulla facilisi morbi tempus iaculis. In hac habitasse platea dictumst vestibulum. Donec adipiscing tristique risus nec feugiat in fermentum posuere urna.
      </p>
    </motion.div>
  )
}