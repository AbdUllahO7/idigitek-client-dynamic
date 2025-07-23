"use client";

import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { ButtonSectionLink } from "@/components/SectionLinks";
import { formatDate } from "@/lib/utils";
import { OptimizedFadeIn } from "@/utils/OptimizedAnimations";
import React, { memo, useMemo } from "react";
import { useOptimizedIntersection } from "@/hooks/useIntersectionObserver";

interface Post {
  id: string;
  image: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  color: string;
  order?: number;
  isMain?: boolean;
}

interface BlogCardProps {
  post: Post;
  index: number;
  isRTL: boolean;
  className?: string;
}

const OptimizedBlogCard = memo<BlogCardProps>(({ post, index, isRTL, className = "" }) => {
  const { direction } = useLanguage();

  // استخدام intersection observer محسّن
  const { ref, isInView } = useOptimizedIntersection({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '100px'
  });

  // حساب التاريخ مرة واحدة
  const formattedDate = useMemo(() => {
    try {
      return formatDate(new Date(post.date), "MMM d, yyyy");
    } catch (error) {
      return post.date;
    }
  }, [post.date]);

  // حساب النص مرة واحدة
  const readMoreText = useMemo(() => {
    return direction === "ltr" ? "Read more" : "اقرأ المزيد";
  }, [direction]);

  // تحسين معالجة الصور
  const handleImageError = useMemo(() => {
    return (e: React.SyntheticEvent<HTMLImageElement>) => {
      const target = e.target as HTMLImageElement;
      if (target.src !== "/placeholder.svg") {
        target.src = "/placeholder.svg";
      }
    };
  }, []);

  return (
    <OptimizedFadeIn
      ref={ref}
      className={`group flex flex-col h-full rounded-2xl border border-wtheme-border/40 bg-wtheme-background/80 backdrop-blur-sm shadow-lg shadow-primary/5 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 ${className}`}
      delay={index * 100}
      duration={600}
      direction="up"
      distance={30}
    >
      {/* Image Container - محسّن للأداء */}
      <div className="relative w-full h-40 sm:h-48 md:h-56 overflow-hidden">
        {/* Category Badge */}
        <div className={`absolute top-3 md:top-4 ${isRTL ? "right-3 md:right-4" : "left-3 md:left-4"} z-10`}>
          <span className="inline-block px-2 py-0.5 md:px-3 md:py-1 text-xs font-accent font-medium rounded-full bg-primary text-white backdrop-blur-sm shadow-sm">
            {post.category || "No Category"}
          </span>
        </div>

        {/* Image with optimized loading */}
        <div className="relative w-full h-full group-hover:scale-[1.02] transition-transform duration-700 ease-out">
          <Image
            src={post.image || "/placeholder.svg"}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover"
            onError={handleImageError}
            loading={index < 3 ? "eager" : "lazy"} // تحميل أول 3 صور فقط eager
            quality={index < 3 ? 85 : 75} // جودة أقل للصور غير المهمة
          />
          
          {/* Hover Overlay - محسّن بـ CSS */}
          <div 
            className="absolute inset-0 bg-gradient-to-t from-wtheme-background/90 via-wtheme-background/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ willChange: 'opacity' }}
          />
        </div>
      </div>

      {/* Content Container */}
      <div className="flex flex-col flex-1 p-4 md:p-5 lg:p-7">
        <div className="space-y-3 md:space-y-4 flex-1">
          {/* Title */}
          <h3 
            className={`font-heading font-bold text-base md:text-lg lg:text-xl leading-tight text-wtheme-text group-hover:text-wtheme-hover transition-colors duration-300 ${isRTL ? "text-right" : "text-left"}`}
            title={post.title} // للـ accessibility
          >
            {post.title}
          </h3>
          
          {/* Excerpt */}
          <p 
            className={`text-xs md:text-sm font-body text-wtheme-text line-clamp-2 ${isRTL ? "text-right" : "text-left"}`}
            title={post.excerpt} // للـ accessibility
          >
            {post.excerpt}
          </p>
          
          {/* Footer with Date and Button */}
          <div className={`flex items-center justify-between pt-2 mt-auto ${isRTL ? "flex-row-reverse" : ""}`}>
            <time 
              className="text-xs font-body text-wtheme-text"
              dateTime={post.date}
            >
              {formattedDate}
            </time>
            
            <ButtonSectionLink
              href={`/Pages/BlogDetailPage/${post.id}`}
              className="group text-xs md:text-sm font-accent px-3 py-1.5 md:px-4 md:py-2 bg-primary text-white shadow hover:opacity-90 transition-opacity duration-300"
              aria-label={`Read more about ${post.title}`}
            >
              {readMoreText}
              <ArrowRight
                className={`${isRTL ? "mr-1 md:mr-2 rotate-180" : "ml-1 md:ml-2"} h-3 w-3 md:h-4 md:w-4 transition-transform duration-300 ${isRTL ? "group-hover:-translate-x-1" : "group-hover:translate-x-1"}`}
                aria-hidden="true"
              />
            </ButtonSectionLink>
          </div>
        </div>
      </div>
    </OptimizedFadeIn>
  );
});

OptimizedBlogCard.displayName = 'OptimizedBlogCard';

export { OptimizedBlogCard };

export const useBlogCardOptimizations = (posts: Post[]) => {
  // تقسيم المقالات إلى مجموعات للتحميل التدريجي
  const postGroups = useMemo(() => {
    const chunkSize = 6; // تحميل 6 مقالات في كل مرة
    const groups = [];
    for (let i = 0; i < posts.length; i += chunkSize) {
      groups.push(posts.slice(i, i + chunkSize));
    }
    return groups;
  }, [posts]);

  // معلومات التحسين
  const optimizationInfo = useMemo(() => ({
    totalPosts: posts.length,
    groupsCount: postGroups.length,
    averagePostsPerGroup: postGroups.length > 0 ? Math.round(posts.length / postGroups.length) : 0
  }), [posts.length, postGroups.length]);

  return {
    postGroups,
    optimizationInfo
  };
};