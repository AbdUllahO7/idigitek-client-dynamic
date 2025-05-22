export interface BlogPost {
    id: string
    title: string
    excerpt: string
    date: string
    image: string
    author: string
    category: string
    readTime: string
  }
  
  export interface BlogTranslations {
    backButton: string
    publishedOn: string
    readTime: string
    sharePost: string
    savePost: string
    leaveComment: string
    relatedPosts: string
    notFound: string
    goBack: string
    author: string
    category: string
    readMore: string
    [key: string]: string
  }