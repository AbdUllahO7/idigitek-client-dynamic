import { useLanguage } from "@/contexts/language-context"

// Translation content component
const TranslationContentComponent = () => {
    const { language } = useLanguage()
    
    const translations = {
      en: {
        backButton: "Back to Blog",
        publishedOn: "Published on",
        readTime: "Read time",
        sharePost: "Share Post",
        savePost: "Save Post",
        leaveComment: "Leave a Comment",
        relatedPosts: "Related Posts",
        notFound: "Blog post not found",
        goBack: "Go back to blog",
        author: "Author",
        category: "Category",
        readMore: "Read more"
      },
      ar: {
        backButton: "العودة إلى المدونة",
        publishedOn: "نُشر في",
        readTime: "وقت القراءة",
        sharePost: "مشاركة المقال",
        savePost: "حفظ المقال",
        leaveComment: "اترك تعليقًا",
        relatedPosts: "مقالات ذات صلة",
        notFound: "لم يتم العثور على المقال",
        goBack: "العودة إلى المدونة",
        author: "الكاتب",
        category: "التصنيف",
        readMore: "اقرأ المزيد"
      }
    }
  
    return translations[language === "ar" ? "ar" : "en"]
  }