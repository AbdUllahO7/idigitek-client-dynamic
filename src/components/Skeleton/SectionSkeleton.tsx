import { Skeleton } from "@/components/ui/skeleton"

interface SectionSkeletonProps {
  variant?: "default" | "grid" | "cards" | "testimonials" | "contact"
  className?: string
}

export function SectionSkeleton({ variant = "default", className = "" }: SectionSkeletonProps) {
  const baseClasses = "py-20"
  const sectionClasses = `${baseClasses} ${className}`

  if (variant === "grid") {
    return (
      <section className={sectionClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-10 w-96 mx-auto" />
            <Skeleton className="h-6 w-128 mx-auto" />
          </div>
          {/* Grid items */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className="space-y-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="h-6 w-32" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "cards") {
    return (
      <section className={sectionClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-10 w-96 mx-auto" />
          </div>
          {/* Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg p-6 space-y-4">
                <Skeleton className="w-full h-48 rounded-lg" />
                <Skeleton className="h-6 w-3/4" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
                <Skeleton className="h-10 w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "testimonials") {
    return (
      <section className={sectionClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-10 w-96 mx-auto" />
          </div>
          {/* Testimonials */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div key={item} className="border rounded-lg p-6 space-y-4">
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Skeleton key={star} className="w-5 h-5" />
                  ))}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-3/5" />
                </div>
                <div className="flex items-center space-x-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (variant === "contact") {
    return (
      <section className={sectionClasses}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section header */}
          <div className="text-center space-y-4 mb-16">
            <Skeleton className="h-6 w-24 mx-auto" />
            <Skeleton className="h-10 w-96 mx-auto" />
            <Skeleton className="h-6 w-128 mx-auto" />
          </div>
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div className="space-y-8">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center space-x-4">
                  <Skeleton className="w-12 h-12 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              ))}
            </div>
            {/* Contact form */}
            <div className="border rounded-lg p-6 space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-32 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  // Default variant
  return (
    <section className={sectionClasses}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Skeleton className="h-6 w-24" />
            <div className="space-y-3">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-4/5" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-4/5" />
              <Skeleton className="h-5 w-3/5" />
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="text-center space-y-2">
                  <Skeleton className="h-8 w-16 mx-auto" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <Skeleton className="w-full h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    </section>
  )
}
