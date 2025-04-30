import Dropdown from "@/components/generic/Dropdown"
import MultipleDropdown from "@/components/generic/MultipleDropdown"
import { FulL_DAY_ID_FILTER, HALF_DAY_ID_FILTER, TOUR_FILTER_LOCATION_OPTIONS, TOUR_FILTER_TIME_OPTIONS } from "@/data/tours"
import { Tour } from "@/data/types"
import { useCallback, useEffect, useMemo, useState } from "react"

type Props = {
  allTours: Tour[],
  // eslint-disable-next-line no-unused-vars
  handleSelectedTours: (tours: Tour[]) => void
}

type DropdownDefaultOption = {
  id: string 
  value: string
}

const ToursFilter = ({ allTours, handleSelectedTours }: Props) => {

  const timeOptions: DropdownDefaultOption[] = TOUR_FILTER_TIME_OPTIONS
  const locationOptions: DropdownDefaultOption[] = TOUR_FILTER_LOCATION_OPTIONS
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<DropdownDefaultOption | null>(null)
  const [selectedLocationsFilter, setSelectedLocationsFilter] = useState<DropdownDefaultOption[]>([])

  const hasActiveFilters = useMemo(() => selectedLocationsFilter.length || selectedTimeFilter , [selectedLocationsFilter.length, selectedTimeFilter])

  useEffect(() => {
    let filteredTours: Tour[] = allTours

    if (selectedTimeFilter) {
      filteredTours = allTours.filter(({ duration }) => {
        if(selectedTimeFilter.id === FulL_DAY_ID_FILTER) {
          return duration > 4
        }
        if(selectedTimeFilter.id === HALF_DAY_ID_FILTER) {
          return duration <= 4
        }

        return false
      })
    } 

    if (selectedLocationsFilter.length) {
      filteredTours = filteredTours.filter(({ locations }) => 
        selectedLocationsFilter.some((location) => locations.includes(location.value))
      )
    } 
    handleSelectedTours(filteredTours)
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLocationsFilter, selectedTimeFilter, allTours])
  
  const handleClearFilters = useCallback(() => {
    setSelectedLocationsFilter([])
    setSelectedTimeFilter(null)
  }, [])

  return (
    <div className="flex">
      <Dropdown 
        list={timeOptions}
        value={selectedTimeFilter}
        handleChange={setSelectedTimeFilter}
        mapId={(item) => item.id}
        mapValue={(item) => item.value}
      />
      <MultipleDropdown 
        list={locationOptions}
        value={selectedLocationsFilter}
        handleChange={setSelectedLocationsFilter}
        mapId={(item) => item.id}
        mapValue={(item) => item.value}
      />

      {
        hasActiveFilters ? (
          <button 
            type="button" 
            onClick={handleClearFilters}
            className="text-black ring-1 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-200 font-medium rounded-full text-sm px-3 ml-3"
          >
        Clear Filters
          </button>
        ) : null
      }
    </div>
  )
}

export default ToursFilter