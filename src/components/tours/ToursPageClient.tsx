"use client"

import { Button } from "@/components/ui/Button"
import { Search } from "lucide-react"
import useTourFilters from "@/hooks/useTourFilters"
import ToursFilter from "@/components/ToursFilter"
import TourGrid from "@/components/TourGrid"
import type { Tour, Location } from "@/cms/types"

type Props = {
  tours: Tour[]
  locations: Location[]
}

const ToursPageClient = ({ tours, locations }: Props) => {
  const locationsValues = locations.map((location) => location.value)

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
  } = useTourFilters({ tours, locations: locationsValues })

  return (
    <>
      {/* Filters Section */}
      <section className="bg-muted/30 border-b border-border sticky top-0 z-40">
        <ToursFilter
          searchQuery={searchQuery}
          selectedLocations={selectedLocations}
          selectedDuration={selectedDuration}
          hasActiveFilters={hasActiveFilters}
          availableLocations={locationsValues}
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
              <TourGrid tours={filteredTours} />
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

export default ToursPageClient

