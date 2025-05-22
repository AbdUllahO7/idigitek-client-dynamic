import Link from "next/link"
import { Button } from "@/components/ui/button"

export function NotFound({ t }) {
    return (
        <div className="container px-4 md:px-6 py-20 text-center">
        <h1 className="text-3xl font-bold mb-6">News Article Not Found</h1>
        <p className="text-muted-foreground mb-8">
            The news article you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
            <Link href="/Pages/NewsPage">{t.viewAllNews}</Link>
        </Button>
        </div>
    )
}