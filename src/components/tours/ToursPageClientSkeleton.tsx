const ToursPageClientSkeleton = () => {
  return (
    <>
      {/* Filters Section Skeleton */}
      <section className="bg-muted/30 border-b border-border sticky top-0 z-40">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input Skeleton */}
            <div className="flex-1">
              <div className="h-10 bg-muted rounded-md animate-pulse" />
            </div>

            {/* Desktop Filters Skeleton */}
            <div className="hidden lg:flex gap-4">
              <div className="h-10 w-[200px] bg-muted rounded-md animate-pulse" />
              <div className="h-10 w-[200px] bg-muted rounded-md animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* Tours Grid Skeleton */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mb-6">
            <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="border border-border rounded-lg overflow-hidden"
              >
                {/* Image Skeleton */}
                <div className="aspect-[4/3] bg-muted animate-pulse" />
                
                {/* Content Skeleton */}
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-muted rounded animate-pulse" />
                  <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
                  
                  {/* Meta info skeleton */}
                  <div className="flex items-center gap-4 pt-2">
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                    <div className="h-4 w-16 bg-muted rounded animate-pulse" />
                  </div>
                  
                  {/* Button skeleton */}
                  <div className="pt-2">
                    <div className="h-10 w-full bg-muted rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ToursPageClientSkeleton

