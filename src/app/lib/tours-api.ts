// This file will be your API layer for fetching tours
// Currently uses static data, but ready to be replaced with CMS fetch

import { tours, type Tour, type Location } from "./tours"

/**
 * Fetch all tours from CMS/API
 * TODO: Replace with actual CMS fetch when ready
 * Example:
 *   const response = await fetch(`${CMS_URL}/tours`)
 *   return response.json()
 */
export async function fetchTours(): Promise<Tour[]> {
  // Simulate API delay (remove in production)
  // await new Promise(resolve => setTimeout(resolve, 100))
  
  // For now, return static data
  // In the future, this will fetch from your CMS
  return tours
}

/**
 * Server-side filtering function
 * Can be used for initial server-rendered filtered results
 */
export function filterTours(
  tours: Tour[],
  searchQuery: string,
  selectedLocations: string[],
  selectedDuration: string
): Tour[] {
  return tours.filter((tour) => {
    const matchesSearch = tour.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.some((loc) =>
        tour.locations.includes(loc as Location)
      )
    const matchesDuration =
      selectedDuration === "all" ||
      (selectedDuration === "short" && tour.duration <= 4) ||
      (selectedDuration === "medium" &&
        tour.duration > 4 &&
        tour.duration <= 7) ||
      (selectedDuration === "long" && tour.duration > 7)

    return matchesSearch && matchesLocation && matchesDuration
  })
}

