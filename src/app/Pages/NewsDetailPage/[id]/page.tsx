"use client"

import { use } from "react"
import { useLanguage } from "@/contexts/language-context"
import { translationsNews } from "@/components/Pages/Home/ConstData/ConstData"
import { NotFound } from "@/components/Pages/NewsDetailPage/NotFound"
import { FeaturedImage } from "@/components/Pages/NewsDetailPage/FeaturedImage"
import { ArticleContent } from "@/components/Pages/NewsDetailPage/ArticleContent"
import { Sidebar } from "@/components/Pages/NewsDetailPage/Sidebar"
import { RelatedArticles } from "@/components/Pages/NewsDetailPage/RelatedArticles"
import { NewsHero } from "@/components/Pages/NewsDetailPage/NewsHero"

export default function NewsDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { language, direction } = useLanguage()
  
  // Unwrap params using React.use()
  const resolvedParams = use(params)
  const newsId = resolvedParams.id
  
  // Get translations for the current language
  const t = translationsNews[language] || translationsNews.en
  
  // Access the news array from the translations
  const newsArray = t.news || []
  
  // Find the current news article
  const currentNews = newsArray.find((news) => news.id === newsId)

  // Find related news (same category, excluding current)
  const relatedNews = currentNews
    ? newsArray.filter((news) => news.category === currentNews.category && news.id !== currentNews.id).slice(0, 3)
    : []

  // If news not found
  if (!currentNews) {
    return <NotFound t={t} />
  }

  return (
    <div className="min-h-screen bg-background" dir={direction}>
      {/* Hero section with title and category */}
      <NewsHero news={currentNews} t={t} />

      {/* Featured image */}
      <FeaturedImage image={currentNews.image} title={currentNews.title} />

      {/* Article content and sidebar */}
      <section className="container px-4 md:px-6 mb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_250px] gap-8">
          {/* Main content */}
          <ArticleContent content={currentNews.excerpt} />
          
          {/* Sidebar with related articles */}
          <Sidebar currentNews={currentNews} allNews={newsArray} />
        </div>
      </section>

      {/* Related articles section */}
      <RelatedArticles relatedNews={relatedNews} t={t} />

    
    </div>
  )
}