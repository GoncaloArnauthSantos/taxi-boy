"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Tour } from "@/cms/types"

type Props = {
  tours: Tour[]
  locations: string[]
}

const useTourFilters = ({ tours, locations }: Props) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("search") || ""
  )
  const [selectedLocations, setSelectedLocations] = useState<string[]>(() => {
    const locationsParam = searchParams.get("location")
    return locationsParam
      ? locationsParam
        .split(",")
        .filter((loc) => locations.includes(loc))
      : []
  })
  const [selectedDuration, setSelectedDuration] = useState<string>(
    searchParams.get("duration") || "all"
  )

  // Sync filters with URL
  useEffect(() => {
    const params = new URLSearchParams()

    if (searchQuery) params.set("search", searchQuery)
    if (selectedLocations.length > 0)
      params.set("location", selectedLocations.join(","))
    if (selectedDuration !== "all") params.set("duration", selectedDuration)

    const queryString = params.toString()
    router.replace(`/tours${queryString ? `?${queryString}` : ""}`, {
      scroll: false,
    })
  }, [searchQuery, selectedLocations, selectedDuration, router])

  // Filter tours based on current filters
  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchesSearch = tour.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
      const matchesLocation =
        selectedLocations.length === 0 ||
        selectedLocations.some((loc) =>
          tour.locations.some((tourLocation) => tourLocation.value === loc)
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
  }, [tours, searchQuery, selectedLocations, selectedDuration])

  // Helper functions
  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location)
        ? prev.filter((loc) => loc !== location)
        : [...prev, location]
    )
  }

  const removeLocation = (location: string) => {
    setSelectedLocations((prev) => prev.filter((loc) => loc !== location))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedLocations([])
    setSelectedDuration("all")
  }

  const hasActiveFilters =
    searchQuery !== "" ||
    selectedLocations.length > 0 ||
    selectedDuration !== "all"

  const getDurationLabel = (duration: string) => {
    switch (duration) {
    case "short":
      return "Short (≤4h)"
    case "medium":
      return "Medium (5-7h)"
    case "long":
      return "Long (8+h)"
    default:
      return "All Durations"
    }
  }

  return {
    // State
    searchQuery,
    selectedLocations,
    selectedDuration,
    filteredTours,
    hasActiveFilters,
    // Setters
    setSearchQuery,
    setSelectedDuration,
    // Actions
    toggleLocation,
    removeLocation,
    clearFilters,
    // Helpers
    getDurationLabel,
  }
}

export default useTourFilters