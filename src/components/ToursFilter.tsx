"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/Dropdown-menu";
import { Label } from "@/components/ui/label";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";

type Props = {
  searchQuery: string;
  selectedLocations: string[];
  selectedDuration: string;
  hasActiveFilters: boolean;
  availableLocations: string[];
  setSearchQuery: (searchQuery: string) => void;
  setSelectedDuration: (selectedDuration: string) => void;
  toggleLocation: (location: string) => void;
  removeLocation: (location: string) => void;
  clearFilters: () => void;
  getDurationLabel: (duration: string) => string;
};

const ToursFilter = ({
  searchQuery,
  selectedLocations,
  selectedDuration,
  hasActiveFilters,
  availableLocations,
  setSearchQuery,
  setSelectedDuration,
  toggleLocation,
  removeLocation,
  clearFilters,
  getDurationLabel,
}: Props) => {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <>
      <div className="container mx-auto px-4 lg:px-8 pt-4 pb-2 md:py-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search tours by title..."
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchQuery(e.target.value)
                }
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {/* Toggle Filters Button (Mobile) */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full justify-center gap-2"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  name="locations-filter"
                  variant="outline"
                  className="w-[200px] justify-between bg-background"
                >
                  <span>
                    {selectedLocations.length === 0
                      ? "All Locations"
                      : `${selectedLocations.length} selected`}
                  </span>
                  <SlidersHorizontal className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent className="w-[200px]">
                {availableLocations.map((location) => (
                  <DropdownMenuCheckboxItem
                    key={location}
                    checked={selectedLocations.includes(location)}
                    onCheckedChange={() => toggleLocation(location)}
                  >
                    {location}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  name="duration-filter"
                  variant="outline"
                  className="w-[200px] justify-between bg-background"
                >
                  <span>
                    {selectedDuration === "all"
                      ? "All Durations"
                      : getDurationLabel(selectedDuration)}
                  </span>
                  <SlidersHorizontal className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuCheckboxItem
                  checked={selectedDuration === "all"}
                  onCheckedChange={() => setSelectedDuration("all")}
                >
                  All Durations
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedDuration === "short"}
                  onCheckedChange={() =>
                    setSelectedDuration(
                      selectedDuration === "short" ? "all" : "short"
                    )
                  }
                >
                  Short (≤4 hours)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedDuration === "medium"}
                  onCheckedChange={() =>
                    setSelectedDuration(
                      selectedDuration === "medium" ? "all" : "medium"
                    )
                  }
                >
                  Medium (5-7 hours)
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedDuration === "long"}
                  onCheckedChange={() =>
                    setSelectedDuration(
                      selectedDuration === "long" ? "all" : "long"
                    )
                  }
                >
                  Long (8+ hours)
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {hasActiveFilters && (
              <Button name="clear-filters" variant="ghost" onClick={clearFilters} size="icon">
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <>
            <div className="lg:hidden flex my-4 gap-6">
              <div>
                <div className="inline-block mb-1">
                  <Label className="text-sm font-medium mb-2 bg-background/50 backdrop-blur-sm px-2 py-1 rounded-md">
                    Location
                  </Label>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-background"
                    >
                      <span>
                        {selectedLocations.length === 0
                          ? "All Locations"
                          : `${selectedLocations.length} selected`}
                      </span>
                      <SlidersHorizontal className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    {availableLocations.map((location) => (
                      <DropdownMenuCheckboxItem
                        key={location}
                        checked={selectedLocations.includes(location)}
                        onCheckedChange={() => toggleLocation(location)}
                      >
                        {location}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div>
                <div className="inline-block mb-1">
                  <Label className="text-sm font-medium mb-2 bg-background/50 backdrop-blur-sm px-2 py-1 rounded-md">
                    Duration
                  </Label>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-between bg-background"
                    >
                      <span>
                        {selectedDuration === "all"
                          ? "All Durations"
                          : getDurationLabel(selectedDuration)}
                      </span>
                      <SlidersHorizontal className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuCheckboxItem
                      checked={selectedDuration === "all"}
                      onCheckedChange={() => setSelectedDuration("all")}
                    >
                      All Durations
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedDuration === "short"}
                      onCheckedChange={() =>
                        setSelectedDuration(
                          selectedDuration === "short" ? "all" : "short"
                        )
                      }
                    >
                      Short (≤4 hours)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedDuration === "medium"}
                      onCheckedChange={() =>
                        setSelectedDuration(
                          selectedDuration === "medium" ? "all" : "medium"
                        )
                      }
                    >
                      Medium (5-7 hours)
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={selectedDuration === "long"}
                      onCheckedChange={() =>
                        setSelectedDuration(
                          selectedDuration === "long" ? "all" : "long"
                        )
                      }
                    >
                      Long (8+ hours)
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {hasActiveFilters && (
              <Button
                name="clear-filters"
                variant="outline"
                onClick={clearFilters}
                className="w-full bg-background/50 backdrop-blur-sm lg:bg-transparent"
              >
                Clear Filters
              </Button>
            )}
          </>
        )}

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {selectedLocations.map((location) => (
              <Badge
                key={location}
                variant="outline"
                className="gap-1 pr-1 cursor-pointer text-xs px-2 py-1 bg-background/50 backdrop-blur-sm lg:bg-transparent"
                onClick={() => removeLocation(location)}
              >
                {location}
                <X className="w-3 h-3" />
              </Badge>
            ))}
            {selectedDuration !== "all" && (
              <Badge
                variant="outline"
                className="gap-1 pr-1 cursor-pointer text-xs px-2 py-1 bg-background/50 backdrop-blur-sm lg:bg-transparent"
                onClick={() => setSelectedDuration("all")}
              >
                {getDurationLabel(selectedDuration)}
                <X className="w-3 h-3" />
              </Badge>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ToursFilter;
