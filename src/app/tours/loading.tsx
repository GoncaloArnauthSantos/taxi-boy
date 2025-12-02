export default function Loading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
        </div>
        <p className="text-muted-foreground mt-8">Loading tours...</p>
      </div>
    </div>
  )
}
