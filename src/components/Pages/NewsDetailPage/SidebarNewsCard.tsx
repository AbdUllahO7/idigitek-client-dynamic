import Link from "next/link"
import Image from "next/image"

export function SidebarNewsCard({ item }) {
    return (
        <Link href={`/Pages/NewsDetailPage/${item.id}`} className="flex items-start gap-3 group">
        <div className="relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
            <Image
            src={item.image || "/placeholder.svg"}
            alt={item.title}
            fill
            className="object-cover"
            />
        </div>
        <div>
            <h4 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-2">
            {item.title}
            </h4>
            <p className="text-xs text-muted-foreground mt-1">
            {new Date(item.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            })}
            </p>
        </div>
        </Link>
    )
}