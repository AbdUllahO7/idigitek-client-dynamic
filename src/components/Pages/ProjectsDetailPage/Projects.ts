// Project data types
export interface Project {
    id: string
    title: string
    description: string
    image: string
    category: string
    technologies: string[]
    color: string
    client: string
    year: string
    challenge: string
    solution: string
    results: string
    testimonial: {
      quote: string
      author: string
      role: string
    }
    gallery: string[]
  }
  
