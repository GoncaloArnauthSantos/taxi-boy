"use client"

import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { useCallback } from "react"

type Props<T> = {
    defaultValue?: string
    list: T[]
    value: T[]
    // eslint-disable-next-line no-unused-vars
    handleChange: (items: T[]) => void
    // eslint-disable-next-line no-unused-vars
    mapValue?: (item: T) => string
    // eslint-disable-next-line no-unused-vars
    mapId?: (item: T) => string
} 

export default function MultipleDropdown<T>({ list, value, defaultValue, handleChange, mapId, mapValue }: Props<T>) {

  const mapDropdownValue = useCallback((value: T): string => {

    return mapValue ? mapValue(value) : value as string
  }, [mapValue])

  const mapDropdownId = useCallback((value: T): string => {

    return mapId ? mapId(value) : value as string
  }, [mapId])

  if(!list || list.length === 0) {
    return null
  }

  return (
    <div className="w-64">
      <Listbox value={value} onChange={handleChange} multiple>
        {({ open }) => (
          <div className="relative mt-1">
            <ListboxButton 
              className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left border border-gray-300 shadow-sm hover:ring-1"
            >
              <span className="block truncate">
                {value.length ? value.length === 1 ? mapDropdownValue(value[0]): `${mapDropdownValue(value[0])}, +${value.length -1}`: defaultValue || "Select options"}
              </span>
              
              <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                { open ? <ChevronUp className="h-4 w-4 text-black"/> : <ChevronDown className="h-4 w-4 text-black" /> }
              </span>
            </ListboxButton>
              
            <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              {list.map((item) => (
                <ListboxOption
                  key={mapDropdownId(item)}
                  value={item}

                  className={({ selected }) =>
                    `relative cursor-pointer select-none py-2 p-4 ${
                      selected ? "bg-blue-100 text-blue-900 pl-6" : "text-gray-900"
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                        {mapDropdownValue(item)}
                      </span>
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        )}
      </Listbox>
    </div>
  )
}