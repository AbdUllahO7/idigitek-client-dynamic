export interface Post {
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