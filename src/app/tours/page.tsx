"use client"

import { TourCard } from "@/components/TourCard"
import { Button } from "@/components/ui/Button"
import { Search } from "lucide-react"
import { useTourFilters } from "@/hooks/useTourFilters"
import ToursFilter from "@/components/ToursFilter"

/**
 * Simple client-side approach - perfect for <100 tours
 * - Instant filtering (no page reloads)
 * - Simple and maintainable
 * - When you have 1000+ tours, consider server-side filtering
 */
export default function ToursPage() {
  const {
    searchQuery,
    selectedLocations,
    selectedDuration,
    filteredTours,
    hasActiveFilters,
    setSearchQuery,
    setSelectedDuration,
    toggleLocation,
    removeLocation,
    clearFilters,
    getDurationLabel,
  } = useTourFilters()

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-balance">
            All Tours
          </h1>
          <p className="text-lg text-primary-foreground/90 max-w-2xl">
            Explore our complete collection of tours and find the perfect
            experience for your visit to Lisbon and beyond
          </p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="bg-muted/30 border-b border-border sticky top-0 z-40">
        <ToursFilter
          searchQuery={searchQuery}
          selectedLocations={selectedLocations}
          selectedDuration={selectedDuration}
          hasActiveFilters={hasActiveFilters}
          setSearchQuery={setSearchQuery}
          setSelectedDuration={setSelectedDuration}
          toggleLocation={toggleLocation}
          removeLocation={removeLocation}
          clearFilters={clearFilters}
          getDurationLabel={getDurationLabel}
        />
      </section>

      {/* Tours Grid */}
      <section className="py-12 lg:py-16">
        <div className="container mx-auto px-4 lg:px-8">
          {filteredTours.length > 0 ? (
            <>
              <div className="mb-6 text-muted-foreground">
                Showing {filteredTours.length}{" "}
                {filteredTours.length === 1 ? "tour" : "tours"}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} {...tour} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="text-muted-foreground mb-4">
                <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  No tours found
                </h3>
                <p>Try adjusting your filters or search query</p>
              </div>
              {hasActiveFilters && (
                <Button
                  onClick={clearFilters}
                  variant="outline"
                  className="mt-4 bg-transparent"
                >
                  Clear Filters
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  )
}
