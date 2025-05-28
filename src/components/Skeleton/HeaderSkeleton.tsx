import { Skeleton } from "../ui/skeleton";

export function HeaderSkeleton() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo skeleton */}
          <div className="flex items-center space-x-2">
            <Skeleton className="w-8 h-8 rounded-lg" />
            <Skeleton className="h-6 w-24" />
          </div>

          {/* Desktop navigation skeleton */}
          <nav className="hidden md:flex items-center space-x-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className="h-4 w-16" />
            ))}
          </nav>

          {/* CTA buttons skeleton */}
          <div className="hidden md:flex items-center space-x-4">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-24" />
          </div>

          {/* Mobile menu button skeleton */}
          <Skeleton className="md:hidden w-10 h-10" />
        </div>
      </div>
    </header>
  )
}
