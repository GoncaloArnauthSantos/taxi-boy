import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import useTourFilters from "../useTourFilters";
import type { Tour } from "@/cms/types";

// Mock Next.js router
const mockReplace = vi.fn();
const mockRouter = {
  replace: mockReplace,
  push: vi.fn(),
  refresh: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  prefetch: vi.fn(),
};

// Mock Next.js searchParams
const createMockSearchParams = (params: Record<string, string> = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  return {
    get: (key: string) => searchParams.get(key),
    getAll: (key: string) => searchParams.getAll(key),
    has: (key: string) => searchParams.has(key),
    keys: () => Array.from(searchParams.keys()),
    values: () => Array.from(searchParams.values()),
    entries: () => Array.from(searchParams.entries()),
    forEach: (callback: (value: string, key: string) => void) => {
      searchParams.forEach(callback);
    },
    toString: () => searchParams.toString(),
    size: searchParams.size,
    sort: () => searchParams.sort(),
  };
};

// Create mock functions that can be controlled
const mockUseSearchParams = vi.fn(() => createMockSearchParams());

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  useSearchParams: () => mockUseSearchParams(),
}));

describe("useTourFilters", () => {
  const mockTours: Tour[] = [
    {
      id: "1",
      uid: "lisbon-city-tour",
      title: "Lisbon City Tour",
      description: "Explore Lisbon",
      longDescription: "Full description",
      locations: [{ id: "loc1", value: "Lisbon" }],
      bannerImage: null,
      images: [],
      duration: 4, // Short (≤4h)
      price: 50,
      includedItems: [],
    },
    {
      id: "2",
      uid: "sintra-day-trip",
      title: "Sintra Day Trip",
      description: "Visit Sintra",
      longDescription: "Full description",
      locations: [
        { id: "loc2", value: "Sintra" },
        { id: "loc1", value: "Lisbon" },
      ],
      bannerImage: null,
      images: [],
      duration: 6, // Medium (5-7h)
      price: 80,
      includedItems: [],
    },
    {
      id: "3",
      uid: "porto-tour",
      title: "Porto Tour",
      description: "Explore Porto",
      longDescription: "Full description",
      locations: [{ id: "loc3", value: "Porto" }],
      bannerImage: null,
      images: [],
      duration: 8, // Long (8+h)
      price: 100,
      includedItems: [],
    },
  ];

  const mockLocations = ["Lisbon", "Sintra", "Porto"];

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock to use empty searchParams by default
    mockUseSearchParams.mockReturnValue(createMockSearchParams());
  });

  describe("initial state", () => {
    it("should initialize with empty filters when no URL params", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      expect(result.current.searchQuery).toBe("");
      expect(result.current.selectedLocations).toEqual([]);
      expect(result.current.selectedDuration).toBe("all");
      expect(result.current.hasActiveFilters).toBe(false);
    });

    it("should initialize from URL search params", () => {
      mockUseSearchParams.mockReturnValue(
        createMockSearchParams({
          search: "Lisbon",
          location: "Lisbon,Sintra",
          duration: "short",
        })
      );

      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      expect(result.current.searchQuery).toBe("Lisbon");
      expect(result.current.selectedLocations).toEqual(["Lisbon", "Sintra"]);
      expect(result.current.selectedDuration).toBe("short");
      expect(result.current.hasActiveFilters).toBe(true);
    });

    it("should filter out invalid locations from URL params", () => {
      mockUseSearchParams.mockReturnValue(
        createMockSearchParams({
          location: "Lisbon,InvalidLocation",
        })
      );

      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      expect(result.current.selectedLocations).toEqual(["Lisbon"]);
    });
  });

  describe("search query filtering", () => {
    it("should filter tours by title (case insensitive)", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSearchQuery("lisbon");
      });

      expect(result.current.filteredTours).toHaveLength(1);
      expect(result.current.filteredTours[0].title).toBe("Lisbon City Tour");
    });

    it("should return empty array when no tours match search", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSearchQuery("NonExistentTour");
      });

      expect(result.current.filteredTours).toHaveLength(0);
    });

    it("should return all tours when search is empty", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSearchQuery("");
      });

      expect(result.current.filteredTours).toHaveLength(3);
    });
  });

  describe("location filtering", () => {
    it("should filter tours by single location", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.toggleLocation("Lisbon");
      });

      expect(result.current.filteredTours).toHaveLength(2); // Lisbon City Tour and Sintra (has Lisbon too)
      expect(
        result.current.filteredTours.every((tour) =>
          tour.locations.some((loc) => loc.value === "Lisbon")
        )
      ).toBe(true);
    });

    it("should filter tours by multiple locations", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.toggleLocation("Lisbon");
        result.current.toggleLocation("Porto");
      });

      expect(result.current.filteredTours).toHaveLength(3); // All tours (Lisbon matches 2, Porto matches 1)
    });

    it("should return all tours when no location selected", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      expect(result.current.filteredTours).toHaveLength(3);
    });
  });

  describe("duration filtering", () => {
    it("should filter tours by short duration (≤4h)", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSelectedDuration("short");
      });

      expect(result.current.filteredTours).toHaveLength(1);
      expect(result.current.filteredTours[0].duration).toBeLessThanOrEqual(4);
    });

    it("should filter tours by medium duration (5-7h)", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSelectedDuration("medium");
      });

      expect(result.current.filteredTours).toHaveLength(1);
      expect(result.current.filteredTours[0].duration).toBeGreaterThan(4);
      expect(result.current.filteredTours[0].duration).toBeLessThanOrEqual(7);
    });

    it("should filter tours by long duration (8+h)", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSelectedDuration("long");
      });

      expect(result.current.filteredTours).toHaveLength(1);
      expect(result.current.filteredTours[0].duration).toBeGreaterThan(7);
    });

    it("should return all tours when duration is 'all'", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSelectedDuration("all");
      });

      expect(result.current.filteredTours).toHaveLength(3);
    });
  });

  describe("combined filters", () => {
    it("should filter by search + location + duration", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSearchQuery("Lisbon");
        result.current.toggleLocation("Lisbon");
        result.current.setSelectedDuration("short");
      });

      expect(result.current.filteredTours).toHaveLength(1);
      expect(result.current.filteredTours[0].title).toBe("Lisbon City Tour");
    });

    it("should return empty when filters don't match any tour", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSearchQuery("Porto");
        result.current.toggleLocation("Lisbon");
        result.current.setSelectedDuration("short");
      });

      expect(result.current.filteredTours).toHaveLength(0);
    });
  });

  describe("helper functions", () => {
    describe("toggleLocation", () => {
      it("should add location when not present", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        act(() => {
          result.current.toggleLocation("Lisbon");
        });

        expect(result.current.selectedLocations).toContain("Lisbon");
      });

      it("should remove location when already present", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        act(() => {
          result.current.toggleLocation("Lisbon");
          result.current.toggleLocation("Lisbon");
        });

        expect(result.current.selectedLocations).not.toContain("Lisbon");
      });
    });

    describe("removeLocation", () => {
      it("should remove specific location", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        act(() => {
          result.current.toggleLocation("Lisbon");
          result.current.toggleLocation("Porto");
          result.current.removeLocation("Lisbon");
        });

        expect(result.current.selectedLocations).not.toContain("Lisbon");
        expect(result.current.selectedLocations).toContain("Porto");
      });
    });

    describe("clearFilters", () => {
      it("should clear all filters", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        act(() => {
          result.current.setSearchQuery("test");
          result.current.toggleLocation("Lisbon");
          result.current.setSelectedDuration("short");
          result.current.clearFilters();
        });

        expect(result.current.searchQuery).toBe("");
        expect(result.current.selectedLocations).toEqual([]);
        expect(result.current.selectedDuration).toBe("all");
        expect(result.current.hasActiveFilters).toBe(false);
      });
    });

    describe("getDurationLabel", () => {
      it("should return correct label for short duration", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        expect(result.current.getDurationLabel("short")).toBe("Short (≤4h)");
      });

      it("should return correct label for medium duration", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        expect(result.current.getDurationLabel("medium")).toBe("Medium (5-7h)");
      });

      it("should return correct label for long duration", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        expect(result.current.getDurationLabel("long")).toBe("Long (8+h)");
      });

      it("should return default label for unknown duration", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        expect(result.current.getDurationLabel("unknown")).toBe("All Durations");
        expect(result.current.getDurationLabel("all")).toBe("All Durations");
      });
    });

    describe("hasActiveFilters", () => {
      it("should return false when no filters are active", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        expect(result.current.hasActiveFilters).toBe(false);
      });

      it("should return true when search query is active", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        act(() => {
          result.current.setSearchQuery("test");
        });

        expect(result.current.hasActiveFilters).toBe(true);
      });

      it("should return true when location is selected", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        act(() => {
          result.current.toggleLocation("Lisbon");
        });

        expect(result.current.hasActiveFilters).toBe(true);
      });

      it("should return true when duration is not 'all'", () => {
        const { result } = renderHook(() =>
          useTourFilters({ tours: mockTours, locations: mockLocations })
        );

        act(() => {
          result.current.setSelectedDuration("short");
        });

        expect(result.current.hasActiveFilters).toBe(true);
      });
    });
  });

  describe("URL synchronization", () => {
    it("should update URL when search query changes", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSearchQuery("test");
      });

      // Wait for useEffect to run
      expect(mockReplace).toHaveBeenCalled();
    });

    it("should update URL when location changes", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.toggleLocation("Lisbon");
      });

      expect(mockReplace).toHaveBeenCalled();
    });

    it("should update URL when duration changes", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSelectedDuration("short");
      });

      expect(mockReplace).toHaveBeenCalled();
    });

    it("should clear URL params when clearFilters is called", () => {
      const { result } = renderHook(() =>
        useTourFilters({ tours: mockTours, locations: mockLocations })
      );

      act(() => {
        result.current.setSearchQuery("test");
        result.current.clearFilters();
      });

      expect(mockReplace).toHaveBeenCalled();
    });
  });
});

