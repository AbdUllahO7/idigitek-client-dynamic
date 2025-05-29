// src/components/Blog/BlogCard.tsx
"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { ButtonSectionLink } from "@/components/SectionLinks";
import { Post } from "./types";
import { formatDate } from "@/lib/utils";

interface BlogCardProps {
  post: Post;
  index: number;
  isInView: boolean;
  isRTL: boolean;
}

export function BlogCard({ post, index, isInView, isRTL }: BlogCardProps) {
  const { direction } = useLanguage();


  return (
    <motion.div
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, delay: 0.2 + index * 0.1 },
        },
      }}
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="group flex flex-col h-full rounded-2xl border border-border/40 bg-background/80 backdrop-blur-sm shadow-lg shadow-indigo-500/5 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-indigo-500/10"
    >
      <div className="relative w-full h-40 sm:h-48 md:h-56">
        <div className={`absolute top-3 md:top-4 ${isRTL ? "right-3 md:right-4" : "left-3 md:left-4"} z-10`}>
          <span className={`inline-block px-2 py-0.5 md:px-3 md:py-1 text-xs font-medium rounded-full bg-gradient-to-r ${post.color} text-white backdrop-blur-sm shadow-sm`}>
            {post.category || "No Category"}
          </span>
        </div>
        <div className="transition-transform duration-500 ">
        <div className="transition-transform duration-500 ">
            <Image
              src={post.image}
              alt={post.title}
              layout="fill"
              objectFit="cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="w-full h-full"
              onError={() => console.error(`Failed to load image: ${post.image}`)}
              placeholder="blur"
              blurDataURL="/placeholder-image.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
      <div className="flex flex-col flex-1 p-4 md:p-5 lg:p-7">
        <div className="space-y-3 md:space-y-4">
          <h3 className={`font-bold text-base md:text-lg lg:text-xl leading-tight group-hover:text-primary transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}>
            {post.title }
          </h3>
          <p className={`text-xs md:text-sm text-muted-foreground line-clamp-2 ${isRTL ? "text-right" : "text-left"}`}>
            {post.excerpt }
          </p>
          <div className={`flex items-center justify-between pt-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <span className="text-xs text-muted-foreground">
              {formatDate(new Date(post.date), "MMM d, yyyy") }
            </span>
            <ButtonSectionLink
                href={`/Pages/BlogDetailPage/${post.id}`}
              className="group text-xs md:text-sm px-3 py-1.5 md:px-4 md:py-2 bg-neutral-900 text-neutral-50 bg-gradient-to-tr from-digitek-pink to-digitek-purple shadow hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-white dark:hover:bg-neutral-50/90"
            >
              {direction === "ltr" ? "Read more" : "اقرأ المزيد"}
              <ArrowRight
                className={`${isRTL ? "mr-1 md:mr-2 rotate-180" : "ml-1 md:ml-2"} h-3 w-3 md:h-4 md:w-4 transition-transform duration-300 ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
              />
            </ButtonSectionLink>
          </div>
        </div>
      </div>
    </motion.div>
  );
}