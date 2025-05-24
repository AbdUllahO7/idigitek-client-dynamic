import { Card, CardContent } from "@/components/ui/card"
import { SidebarNewsCard } from "./SidebarNewsCard"
import { useLanguage } from "@/contexts/language-context"

export function Sidebar({ currentNews, allNews }) {
  const { direction } = useLanguage()
  
  return (
    <div className="space-y-8">
    
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">
            {direction === 'ltr' ? 'Latest News' : 'اخر الاخبار '}
          </h3>
          <div className="space-y-4">
            {allNews
              .filter((item) => item.id !== currentNews.id)
              .slice(0, 3)
              .map((item) => (
                <SidebarNewsCard key={item.id} item={item} />
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}