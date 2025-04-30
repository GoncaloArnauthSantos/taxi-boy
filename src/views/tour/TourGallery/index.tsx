"use client"
import { Tour } from "@/data/types"
import Link from "next/link"
import ToursFilter from "./ToursFilter"
import { useState } from "react"

type Props = {
  tours: Tour[]
}

const TourGallery = ({ tours }: Props) => {
  const [filteredTours, setFilteredTours ] = useState(tours)

  if (!tours || tours.length === 0) {
    return <NoTours />
  }

  return (
    <>
      <ToursFilter allTours={tours} handleSelectedTours={setFilteredTours} />
      {
        <div className="mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {filteredTours.map((tour, index) => (
              <Link key={index} href={`tours/${tour.id}`} className=" p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{tour.title}</h5>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{tour.description}.</p>
              </Link>
            ))}
          </div>
        </div>
      }
      
    </>
    
  )
}

const NoTours = () => {
  return (
    <div>
      There is no tours to show at the moment
    </div>
  )
}
export default TourGallery

